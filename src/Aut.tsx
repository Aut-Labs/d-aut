import { withRouter, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Portal from '@mui/material/Portal';
import { CSSObject } from '@emotion/react';
import MainDialog from './components/MainDialog';
import { resetUIState } from './store/store';
import { setUseDev } from './services/web3/env';
import { dispatchEvent } from './utils/utils';
import { AutButtonProps } from './types/sw-auth-config';
import { OutputEventTypes } from './types/event-types';
import { autState, setCommunityExtesnionAddress, showDialog } from './store/aut.reducer';
import { useAppDispatch } from './store/store.model';
import { RoundedWebButton } from './components/WebButton';

const AutModal = withRouter(({ container, rootContainer = null }: any) => {
  const dispatch = useAppDispatch();
  const uiState = useSelector(autState);

  const handleClose = (event, reason) => {
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
  const [buttonHidden, setButtonHidden] = useState(false);

  const selectEnvironment = () => {
    if (attributes.useDev) {
      setUseDev(attributes.useDev as boolean);
    } else {
      // dispatch(startValidatingDomain());
      // try {
      //   const isValid = await validateDomain(attributes.partnerKey);
      //   if (!isValid) {
      //     dispatch(showGlobalError('Invalid domain. Please add the URL throught the dashboard.'));
      //   }
      // } catch (e) {
      //   dispatch(showGlobalError('Failed to validate domain.'));
      // } finally {
      //   dispatch(finishValidatingDomain());
      // }
    }
  };

  const setAttributes = () => {
    if (attributes.communityAddress) {
      console.log(attributes.communityAddress);
      dispatch(setCommunityExtesnionAddress(attributes.communityAddress as string));
    } else {
      console.log('nocommunity extension');
    }
    selectEnvironment();
  };

  const initializeAut = async () => {
    // check timestamp
    // const sw = JSON.parse(sessionStorage.getItem('aut-data'));
    // if (sw) {
    //   const currentTime = new Date().getTime();
    //   // 8 Hours
    //   const sessionLength = new Date(8 * 60 * 60 * 1000 + sw.timestamp).getTime();
    //   if (currentTime < sessionLength) {
    //     const isLoggedIn = true;
    //     dispatch(
    //       setUserData({
    //         username: sw.nickname,
    //         profileImageUrl: sw.imageUrl,
    //         isLoggedIn,
    //       })
    //     );
    //     dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
    //   } else {
    //     const isLoggedIn = false;
    //     window.sessionStorage.removeItem('skillWallet');
    //     dispatch(resetUIState);
    //     dispatch(setLoggedIn(isLoggedIn));
    //     dispatchSwEvent(OutputEventTypes.Login, isLoggedIn);
    //   }
    // }
  };

  const handleButtonClick = () => {
    // if (currentUser.isLoggedIn) {

    if (uiState.user) {
      // if (!attributes.useButtonOptions) {
      window.sessionStorage.removeItem('aut-data');
      dispatch(resetUIState);
      dispatchEvent(OutputEventTypes.Disconnected, false);
    } else {
      history.push('/');
      dispatch(resetUIState);
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
            <RoundedWebButton userData={uiState.user} onClick={handleButtonClick} onMouseEnter={handleMouseEnter} />
          </>
        )}
      </Portal>
    </>
  );
};

export default AutModal;
