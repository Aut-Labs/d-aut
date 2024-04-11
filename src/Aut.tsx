import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { memo, useEffect, useMemo, useState } from 'react';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { AutID as AutIDModel } from './interfaces/autid.model';
import { dispatchEvent, parseAttributeValue, toCammelCase } from './utils/utils';
import { AutButtonProps, FlowConfig, FlowConfigMode, SwAttributes } from './types/d-aut-config';
import { InputEventTypes, OutputEventTypes } from './types/event-types';
import {
  autState,
  NovaAddress,
  FlowMode,
  setAllowedRoleId,
  setCommunityExtesnionAddress,
  setFlowConfig,
  setJustJoining,
  setUseDev,
  setUser,
  showDialog,
  user,
} from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { IPFSCusomtGateway, setCustomIpfsGateway, setNetworks, updateWalletProviderState } from './store/wallet-provider';
import { ipfsCIDToHttpUrl } from './services/storage/storage.hub';
import AutButtonMenu from './components/AutButtonMenu/AutButtonMenu';
import { AutMenuItemType, MenuItemActionType, AutButtonUserProfile } from './components/AutButtonMenu/AutMenuUtils';
import AutSDK, { AutID } from '@aut-labs/sdk';
import { checkIfAutIdExists, fetchCommunity } from './services/web3/api';
import { MultiSigner } from '@aut-labs/sdk/dist/models/models';
import { useAutConnectorContext } from '.';
import { env } from './services/web3/env';
import { NetworkConfig } from './types/network';

const AutModal = ({ container, rootContainer = null }: any) => {
  const dispatch = useAppDispatch();
  const uiState = useSelector(autState);

  const handleClose = async () => {
    // if (reason && reason === 'backdropClick') return;
    dispatch(showDialog(false));
  };

  useEffect(() => {
    // increase zIndex for the custom container so that the button is under modal
    if (rootContainer) {
      (rootContainer as HTMLElement).style.zIndex = uiState.showDialog ? '999999' : '0';
    }
  }, [uiState, rootContainer]);

  return (
    <>
      <MainDialog open={uiState.showDialog} handleClose={handleClose} container={container} />
    </>
  );
};

export const AutButton = memo(({ config, attributes: defaultAttributes, container, setAttrCallback }: AutButtonProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { disconnect, state, networks } = useAutConnectorContext();

  const customIpfsGateway = useSelector(IPFSCusomtGateway);
  const flowMode = useSelector(FlowMode);
  const novaAddress = useSelector(NovaAddress);
  const userData = useSelector(user);

  const [menuItems, setMenuItems] = useState<AutMenuItemType[]>([]);

  const initializeSDK = async (network: NetworkConfig, multiSigner: MultiSigner) => {
    const sdk = AutSDK.getInstance();
    const autIdContractAddress = network?.contracts?.autIDAddress;

    // If nova address is provided then to ensure is the correct autId address
    // we will fetch contract address from novaAddress contract
    if (novaAddress) {
      await sdk.init(multiSigner, {
        novaAddress,
        autIDAddress: autIdContractAddress,
      });
    } else {
      await sdk.init(multiSigner, {
        autIDAddress: autIdContractAddress,
      });
    }
  };

  const checkForExistingAutId = async (account: string) => {
    const hasAutId = await dispatch(checkIfAutIdExists(account));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity());
      if (!hasAutId.payload) {
        await dispatch(setJustJoining(false));
        navigate('userdetails');
      } else {
        await dispatch(setJustJoining(true));
        navigate('role');
      }
    }
  };

  const handleOpen = async () => {
    if (userData) return;

    if (flowMode === FlowConfigMode.SignIn) {
      navigate('/autid');
    } else if (flowMode === FlowConfigMode.SignUp) {
      navigate('/newuser');
    } else {
      navigate('/');
    }

    dispatch(showDialog(true));
  };

  const handleDisconnect = async () => {
    window.localStorage.removeItem('aut-data');
    disconnect();
    dispatch(resetUIState);
    dispatchEvent(OutputEventTypes.Disconnected);
  };

  const setAttributes = (attributes: SwAttributes) => {
    if (attributes.novaAddress) {
      // console.log(attributes.novaAddress);
      dispatch(setCommunityExtesnionAddress(attributes.novaAddress as string));
    } else {
      // console.log('nocommunity extension');
    }
    if (attributes.ipfsGateway) {
      dispatch(setCustomIpfsGateway(attributes.ipfsGateway as string));
    }

    if (attributes.allowedRoleId) {
      dispatch(setAllowedRoleId(attributes.allowedRoleId as string));
    }

    if (attributes.flowConfig) {
      const flowConfig = attributes.flowConfig as FlowConfig;

      if (!Object.values(FlowConfigMode).includes(flowConfig.mode)) {
        flowConfig.mode = FlowConfigMode.FreeMode;
      }
      dispatch(setFlowConfig(flowConfig));
    }

    if (attributes.useDev) {
      dispatch(setUseDev(attributes.useDev as boolean));
    }

    if (attributes.network) {
      const updatedNetwork: NetworkConfig = attributes.network as NetworkConfig;
      const network = networks.find(
        (n: NetworkConfig) => n.chainId === updatedNetwork.chainId || n.name === updatedNetwork.name || n.network === updatedNetwork.network
      );
      if (network) {
        dispatch(
          setNetworks([
            ...networks.filter((n) => network.chainId !== n.chainId), // remove the found network
            {
              ...network,
              ...updatedNetwork,
            },
          ])
        );
      }
    }

    if (attributes.menuItems) {
      try {
        const items: AutMenuItemType[] = attributes.menuItems as AutMenuItemType[];
        setMenuItems([
          ...items.filter((r) => r.actionType !== MenuItemActionType.Default),
          {
            name: 'Disconnect',
            actionType: MenuItemActionType.Default,
            onClick: handleDisconnect,
          },
        ]);
      } catch (error) {
        // error handle
      }
    }
  };

  const initializeAut = async () => {
    dispatchEvent(OutputEventTypes.Init);
    // check timestamp
    const _autId = JSON.parse(localStorage.getItem('aut-data'));
    if (_autId) {
      const autId = new AutIDModel(_autId);
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + autId.properties.loginTimestamp).getTime();
      if (currentTime < sessionLength) {
        dispatch(setUser(autId));
        dispatchEvent(OutputEventTypes.Connected, autId);
        // activateBrowserWallet({ type: autId?.provider }); // activave provider to get address
      } else {
        window.localStorage.removeItem('aut-data');
        dispatch(resetUIState);
        dispatchEvent(OutputEventTypes.Disconnected);
      }
    }
  };

  useEffect(() => {
    dispatch(setNetworks(networks));
    const sdk = new AutSDK({
      ipfs: {
        apiKey: env.REACT_APP_IPFS_API_KEY,
        secretApiKey: env.REACT_APP_IPFS_API_SECRET,
        gatewayUrl: env.REACT_APP_IPFS_GATEWAY_URL,
      },
    });
  }, []);

  useEffect(() => {
    const start = async () => {
      let network = networks.find((d) => d.chainId === state.chainId);
      if (!network) {
        [network] = networks.filter((d) => !d.disabled);
      }
      const itemsToUpdate = {
        selectedNetwork: network,
      };

      await initializeSDK(network, state.multiSigner);
      await dispatch(updateWalletProviderState(itemsToUpdate));
    };

    if (state?.multiSignerId) {
      start();
    }
  }, [state?.multiSignerId, novaAddress]);

  useEffect(() => {
    setMenuItems([
      {
        name: 'Disconnect',
        actionType: MenuItemActionType.Default,
        onClick: handleDisconnect,
      },
    ]);
    setAttributes(defaultAttributes);
    initializeAut();
    setAttrCallback(async (name: string, _: string, newVal: string) => {
      const key = toCammelCase(name);
      const updatedAttributes = {
        [key]: parseAttributeValue(name, newVal),
      } as SwAttributes;
      setAttributes(updatedAttributes);
    });
  }, []);

  useEffect(() => {
    // window.removeEventListener(InputEventTypes.Open, handleOpen);
    window.addEventListener(InputEventTypes.Open, handleOpen);
    return () => window.removeEventListener(InputEventTypes.Open, handleOpen);
  }, [userData, flowMode]);

  const userProfile: AutButtonUserProfile = useMemo(() => {
    if (!userData?.name) return;
    const [community] = userData?.properties?.communities || [];
    const isAdmin = community?.properties?.userData?.isAdmin;
    return {
      role: isAdmin ? 'Admin' : 'Member',
      name: userData.name,
      avatar: ipfsCIDToHttpUrl(userData.properties.thumbnailAvatar, customIpfsGateway),
    };
  }, [userData, customIpfsGateway]);

  return (
    <>
      <Portal container={container}>
        <AutButtonMenu config={config} container={container} user={userProfile} onMainBtnClick={handleOpen} menuItems={menuItems} />
      </Portal>
    </>
  );
});

export default memo(AutModal);
