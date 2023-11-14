import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
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
import {
  IPFSCusomtGateway,
  IsAuthorised,
  NetworksConfig,
  setCustomIpfsGateway,
  setNetworks,
  updateWalletProviderState,
} from './store/wallet-provider';
import { ipfsCIDToHttpUrl } from './services/storage/storage.hub';
import AutButtonMenu from './components/AutButtonMenu/AutButtonMenu';
import { AutMenuItemType, MenuItemActionType, AutButtonUserProfile } from './components/AutButtonMenu/AutMenuUtils';
import { NetworkConfig } from './services/ProviderFactory/web3.connectors';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import AutSDK, { AutID } from '@aut-labs/sdk';
import { BiconomyContext } from './biconomy_context';
import { useEthersSigner } from './services/ProviderFactory/ethers';
import { checkIfAutIdExists, fetchCommunity, getAutId } from './services/web3/api';
import { MultiSigner } from '@aut-labs/sdk/dist/models/models';

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
  const { disconnectAsync } = useDisconnect();
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });
  const { address, connector, isConnected } = useAccount();

  const customIpfsGateway = useSelector(IPFSCusomtGateway);
  // const isAuthorised = useSelector(IsAuthorised);
  const networks = useSelector(NetworksConfig);
  const flowMode = useSelector(FlowMode);
  const novaAddress = useSelector(NovaAddress);
  const userData = useSelector(user);

  const [menuItems, setMenuItems] = useState<AutMenuItemType[]>([]);
  const BiconomyRef = useContext(BiconomyContext);

  const initializeSDK = async (network: NetworkConfig, multiSigner: MultiSigner) => {
    const sdk = AutSDK.getInstance();
    let autIdContractAddress = network?.contracts?.autIDAddress;

    // If nova address is provided then to ensure is the correct autId address
    // we will fetch contract address from novaAddress contract
    if (novaAddress) {
      // only when novaAddress is present we can create a new user
      // and so only then we should inject biconomy
      const biconomy =
        network?.biconomyApiKey &&
        BiconomyRef &&
        new BiconomyRef({
          enableDebugMode: true,
          apiKey: network.biconomyApiKey,
          contractAddresses: [autIdContractAddress],
        });
      await sdk.init(
        multiSigner,
        {
          novaAddress,
        }
        // biconomy
      );
      const result = await sdk.nova.contract.getAutIDContractAddress();
      autIdContractAddress = result?.data;
      sdk.autID = sdk.initService<AutID>(AutID, autIdContractAddress);
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

    if (flowMode === FlowConfigMode.Dashboard) {
      navigate('/autid');
    } else if (flowMode === FlowConfigMode.TryAut) {
      navigate('/newuser');
    } else {
      navigate('/');
    }

    dispatch(showDialog(true));
  };

  const handleDisconnect = async () => {
    window.localStorage.removeItem('aut-data');
    await disconnectAsync();
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
    const autId = JSON.parse(localStorage.getItem('aut-data'));
    if (autId) {
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + autId.loginTimestamp).getTime();
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
    if (connector?.ready && isConnected && signer && flowMode && networks?.length) {
      const start = async () => {
        const [network] = networks.filter((d) => !d.disabled);
        const itemsToUpdate = {
          isAuthorised: true,
          sdkInitialized: true,
          isOpen: false,
          selectedNetwork: network,
        };

        await initializeSDK(network, signer);
        await dispatch(updateWalletProviderState(itemsToUpdate));

        // if (flowMode === FlowConfigMode.Dashboard) {
        //   navigate('/autid');
        //   await dispatch(getAutId(address));
        // }
        // if (flowMode === FlowConfigMode.TryAut) {
        //   navigate('/newuser');
        //   await checkForExistingAutId(address);
        // }
      };
      start();
    }
  }, [isConnected, connector?.ready, signer, networks, flowMode]);

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
    const isAdmin = community?.properties?.isAdmin;
    return {
      role: isAdmin ? 'Admin' : 'Member',
      name: userData.name,
      avatar: ipfsCIDToHttpUrl(userData.properties.avatar, customIpfsGateway),
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
