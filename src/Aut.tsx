import { withRouter, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { memo, useEffect, useMemo, useState } from 'react';
import Portal from '@mui/material/Portal';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { dispatchEvent, parseAttributeValue, toCammelCase } from './utils/utils';
import { AutButtonProps, FlowConfig, SwAttributes } from './types/d-aut-config';
import { InputEventTypes, OutputEventTypes } from './types/event-types';
import {
  autState,
  FlowMode,
  setAllowedRoleId,
  setCommunityExtesnionAddress,
  setFlowConfig,
  setUseDev,
  setUser,
  showDialog,
  user,
} from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { IPFSCusomtGateway, NetworksConfig, setCustomIpfsGateway, setNetworks, setSelectedNetwork } from './store/wallet-provider';
import { ipfsCIDToHttpUrl } from './services/storage/storage.hub';
import AutButtonMenu from './components/AutButtonMenu/AutButtonMenu';
import { AutMenuItemType, MenuItemActionType, AutButtonUserProfile } from './components/AutButtonMenu/AutMenuUtils';
import { NetworkConfig } from './services/ProviderFactory/web3.connectors';
import { useEthers } from '@usedapp/core';

const AutModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useAppDispatch();
  const uiState = useSelector(autState);

  const handleClose = async (event, reason) => {
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
});

export const AutButton = memo(({ config, attributes: defaultAttributes, container, setAttrCallback }: AutButtonProps) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const uiState = useSelector(autState);
  const flowMode = useSelector(FlowMode);
  const [menuItems, setMenuItems] = useState<AutMenuItemType[]>([]);
  const userData = useSelector(user);
  const customIpfsGateway = useSelector(IPFSCusomtGateway);
  const networks = useSelector(NetworksConfig);
  const { account, isLoading, activateBrowserWallet } = useEthers();

  /*
   * isLoading is used to ensure that the wallet provider (metamask or walletConnect) is ready
   * If userData.address is different from provided address (account)
   * then we should disconnect
   */
  const hasAccountChanged = useMemo(() => {
    return !isLoading && !!userData?.address && !!account && userData?.address !== account;
  }, [userData?.address, account, isLoading]);

  /*
   * isLoading is used to ensure that the wallet provider (metamask or walletConnect) is ready
   * If wallet provider is loaded and there is userData but not account
   * it could mean two things:
   * 1. The user last was loaded by a different provider
   * 2. Metamask or walletConnect is not connected!
   */
  const userWithoutAccount = useMemo(() => {
    return !isLoading && !account && !!userData?.address;
  }, [account, userData?.address, isLoading]);

  const handleOpen = async () => {
    // if (currentUser.isLoggedIn) {
    if (!uiState.user) {
      if (flowMode) {
        if (flowMode === 'dashboard') {
          history.push('/autid');
        }
        if (flowMode === 'tryAut') {
          history.push('/newuser');
        }
      } else {
        history.push('/');
      }

      // if (isActive) {
      //   await connector.deactivate();
      //   // dispatch(setSigner(provider.getSigner()));
      // }
      if (uiState?.provider?.disconnect) {
        await uiState?.provider?.disconnect();
      }
      await dispatch(setSelectedNetwork(null));
      await dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleDisconnect = async () => {
    window.sessionStorage.removeItem('aut-data');
    dispatch(resetUIState);
    dispatchEvent(OutputEventTypes.Disconnected);
  };

  const setAttributes = (attributes: SwAttributes) => {
    if (attributes.daoExpander) {
      // console.log(attributes.daoExpander);
      dispatch(setCommunityExtesnionAddress(attributes.daoExpander as string));
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
      if (flowConfig.mode !== 'dashboard' && flowConfig.mode !== 'tryAut') {
        flowConfig.mode = null;
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
    const autId = JSON.parse(sessionStorage.getItem('aut-data'));
    if (autId) {
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + autId.loginTimestamp).getTime();
      if (currentTime < sessionLength) {
        dispatch(setUser(autId));
        dispatchEvent(OutputEventTypes.Connected, autId);
        activateBrowserWallet({ type: autId?.provider }); // activave provider to get address
      } else {
        window.sessionStorage.removeItem('aut-data');
        dispatch(resetUIState);
        dispatchEvent(OutputEventTypes.Disconnected);
      }
    }
  };

  useEffect(() => {
    if (hasAccountChanged || userWithoutAccount) {
      handleDisconnect();
    }
  }, [hasAccountChanged, userWithoutAccount]);

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
    window.addEventListener(InputEventTypes.Open, handleOpen);
    return () => window.removeEventListener(InputEventTypes.Open, handleOpen);
  }, []);

  useEffect(() => {
    window.removeEventListener(InputEventTypes.Open, handleOpen);
    window.addEventListener(InputEventTypes.Open, handleOpen);
    return () => window.removeEventListener(InputEventTypes.Open, handleOpen);
  }, [userData, flowMode, uiState]);

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
