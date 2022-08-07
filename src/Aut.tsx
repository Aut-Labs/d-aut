import { withRouter, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Portal from '@mui/material/Portal';
import { CSSObject } from '@emotion/react';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { dispatchEvent } from './utils/utils';
import { AutButtonProps } from './types/sw-auth-config';
import { OutputEventTypes } from './types/event-types';
import { autState, setCommunityExtesnionAddress, setUser, showDialog } from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { RoundedWebButton } from './components/WebButton';
import { SelectedNetworkConfig, setNetwork, setSigner } from './store/wallet-provider';
import { getNetwork } from './services/web3/env';
import { EnableAndChangeNetwork } from './services/ProviderFactory/web3.network';
import { useWeb3React } from '@web3-react/core';

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
  // const currentUser = useSelector(currentUserState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonType, setButtonType] = useState('simple');
  const [buttonHidden, setButtonHidden] = useState(false);
  const { connector, isActive, chainId, provider } = useWeb3React();

  useEffect(() => {
    if (provider) {
      dispatch(setSigner(provider.getSigner()));
    }
  }, [chainId, provider]);

  useEffect(() => {
    setAttrCallback(async (name: string, value: string, newVal: string) => {
      if (name === 'network') {
        await dispatch(setNetwork(attributes.network as string));
      }
    });
  });

  const selectEnvironment = async () => {
    await dispatch(setNetwork(attributes.network as string));
  };

  const setAttributes = () => {
    if (attributes.daoExpander) {
      // console.log(attributes.daoExpander);
      dispatch(setCommunityExtesnionAddress(attributes.daoExpander as string));
    } else {
      // console.log('nocommunity extension');
    }
    if (attributes.buttonType) {
      // console.log(attributes.buttonType);
      setButtonType(attributes.buttonType as string);
    } else {
      setButtonType(null);
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
      } else {
        window.sessionStorage.removeItem('aut-data');
        dispatch(resetUIState);
      }
    }
  };

  const handleButtonClick = async () => {
    // if (currentUser.isLoggedIn) {
    if (uiState.user) {
      // if (!attributes.useButtonOptions) {
      window.sessionStorage.removeItem('aut-data');
      dispatch(resetUIState);
      dispatchEvent(OutputEventTypes.Disconnected, false);
    } else {
      history.push('/');

      if (isActive) {
        await connector.deactivate();
        // dispatch(setSigner(provider.getSigner()));
      }
      if (uiState?.provider?.disconnect) {
        await uiState?.provider?.disconnect();
      }
      await dispatch(resetUIState);
      dispatch(showDialog(true));
    }
  };

  const handleMouseEnter = (event) => {
    if (anchorEl !== event.currentTarget && attributes.useButtonOptions && false) {
      setAnchorEl(container);
    }
  };

  const handleMenuButtonClicked = () => {
    window.sessionStorage.removeItem('aut-data');
    dispatch(resetUIState);
    // dispatchEvent(OutputEventTypes.Connected, false);
    setAnchorEl(null);
  };

  const handleHideMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAttributes();
    dispatchEvent(OutputEventTypes.Init);
    // setButtonHidden(attributes.hideButton as boolean);
    // dispatch(setDisableCreateNewUser(attributes.disableCreateNewUser as boolean));

    // setAttrCallback((name: string, prevValue: string, currVal: string) => {
    //   const notChanged = !checkIfAttributeHasChanged(prevValue, currVal);
    //   if (notChanged) {
    //     return; // do nothing if its the same
    //   }
    //   const value = parseAttributeValue(name, currVal);
    //   if (name === AttributeNames.hideButton) {
    //     setButtonHidden(value);
    //   } else if (name === AttributeNames.disableCreateNewUser) {
    //     dispatch(setDisableCreateNewUser(value));
    //   }
    // });
  }, []);

  useEffect(() => {
    initializeAut();
  }, []);

  return (
    <>
      <Portal container={container}>
        {!buttonHidden && (
          <>
            <RoundedWebButton buttontype={buttonType} onClick={handleButtonClick} onMouseEnter={handleMouseEnter} />
          </>
        )}
      </Portal>
    </>
  );
};

export default AutModal;
