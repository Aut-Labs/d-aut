import { withRouter, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Portal from '@mui/material/Portal';
import { CSSObject } from '@emotion/react';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { dispatchEvent } from './utils/utils';
import { AutButtonProps } from './types/d-aut-config';
import { OutputEventTypes } from './types/event-types';
import { autState, setCommunityExtesnionAddress, setUser, showDialog } from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { WebButton } from './components/WebButton';
import { SelectedNetwork, setCustomIpfsGateway, setNetworks, setSelectedNetwork } from './store/wallet-provider';
import { useWeb3React } from '@web3-react/core';
import { Typography } from '@mui/material';
import { userData } from './store/user-data.reducer';

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

export const AutButton = ({ buttonStyles, dropdownStyles, attributes, container, setAttrCallback }: AutButtonProps<CSSObject>) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const uiState = useSelector(autState);
  const [buttonHidden, setButtonHidden] = useState(false);
  const { connector, isActive, chainId, provider } = useWeb3React();

  useEffect(() => {
    setAttrCallback(async (name: string, value: string, newVal: string) => {
      // if (name === 'network') {
      //   await dispatch(setNetwork(newVal as string));
      // }
    });
  });

  const selectEnvironment = async () => {
    // getAppConfig().then(async (res) => dispatch(setNetworks(res)));
    // await dispatch(setNetwork(attributes.network as string));
  };

  const setAttributes = () => {
    if (attributes.daoExpander) {
      // console.log(attributes.daoExpander);
      dispatch(setCommunityExtesnionAddress(attributes.daoExpander as string));
    } else {
      // console.log('nocommunity extension');
    }
    if (attributes.chainId && attributes.networkName && attributes.rpcUrls && attributes.explorerUrls) {
      // const networkConfig = {
      //   chainId: attributes.chainId,
      //   networkName: attributes.networkName,
      //   rpcUrls: (attributes.rpcUrls as string).split(','),
      //   explorerUrls: (attributes.explorerUrls as string).split(','),
      // };
      // console.warn(networkConfig);
      // if (networkConfig) {
      //   dispatch(setNetworks([networkConfig]));
      // }
    }
    if (attributes.ipfsGateway) {
      dispatch(setCustomIpfsGateway(attributes.ipfsGateway as string));
    }
    selectEnvironment();
  };

  const initializeAut = async () => {
    // check timestamp
    const autId = JSON.parse(sessionStorage.getItem('aut-data'));
    if (autId) {
      const currentTime = new Date().getTime();
      // 8 Hours
      const sessionLength = new Date(8 * 60 * 60 * 1000 + autId.loginTimestamp).getTime();
      if (currentTime < sessionLength) {
        dispatch(setUser(autId));
        dispatchEvent(OutputEventTypes.Connected, autId);
      } else {
        window.sessionStorage.removeItem('aut-data');
        dispatch(resetUIState);
        dispatchEvent(OutputEventTypes.Disconnected);
      }
    }
  };

  const handleButtonClick = async () => {
    // if (currentUser.isLoggedIn) {
    if (!uiState.user) {
      history.push('/');

      if (isActive) {
        await connector.deactivate();
        // dispatch(setSigner(provider.getSigner()));
      }
      if (uiState?.provider?.disconnect) {
        await uiState?.provider?.disconnect();
      }
      await dispatch(setSelectedNetwork(null));
      await dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleMenuButtonClicked = async () => {
    window.sessionStorage.removeItem('aut-data');
    dispatch(resetUIState);
    dispatchEvent(OutputEventTypes.Disconnected);
    // setAnchorEl(null);
  };

  const handleProfileButtonClicked = async () => {
    const autId = JSON.parse(sessionStorage.getItem('aut-data'));
    window.open(`https://my.aut.id/${autId.network}/${autId.name}`, '_blank');
  };

  useEffect(() => {
    setAttributes();
    dispatchEvent(OutputEventTypes.Init);
  }, []);

  useEffect(() => {
    initializeAut();
  }, []);

  return (
    <>
      <Portal container={container}>
        {!buttonHidden && (
          <WebButton
            onClick={handleButtonClick}
            disconnectClick={handleMenuButtonClicked}
            profileClick={handleProfileButtonClicked}
            container={container}
          />
        )}
      </Portal>
    </>
  );
};

export default AutModal;
