import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  autState,
  resetWalletConnectThunk,
  setProvider,
  setSelectedAddress,
  switchToMetaMask,
  switchToWalletConnect,
  switchToWalletConnectThunk,
} from '../store/aut.reducer';
import { Box } from '@mui/material';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { providers } from 'ethers';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { useAppDispatch } from '../store/store.model';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { InternalErrorTypes } from '../utils/error-parser';
import { AutHeader } from '../components/AutHeader';
import { useSelector } from 'react-redux';

// const provider = new WalletConnectProvider({
//   rpc: {
//     80001: 'https://matic-mumbai.chainstacklabs.com',
//   },
// });

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const autData = useSelector(autState);
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  useEffect(() => {
    if (autData.provider && autData.isWalletConnect) {
      autData.provider.once('accountsChanged', async (accounts: string[]) => {
        await dispatch(setSelectedAddress(accounts[0]));

        const result = await dispatch(getAutId(null));
        if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
          history.push('/role');
        }
      });
    }
  }, [autData.provider]);

  const handleWalletConnectClick = async () => {
    // if (autData.isWalletConnect) {
    //   if (autData.provider?.connected) {
    //     await dispatch(setSelectedAddress(autData.provider.accounts[0]));
    //     const result = await dispatch(getAutId(null));
    //     if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
    //       history.push('/role');
    //     }
    //   } else {
    //     const wcProvider = await dispatch(resetWalletConnectThunk());
    //     (wcProvider.payload as WalletConnectProvider).enable();
    //   }
    // } else {
    // autData.provider?.disconnect();
    const wcProvider = await dispatch(resetWalletConnectThunk());
    (wcProvider.payload as WalletConnectProvider).enable();
    // }
  };

  const handleMetamaskClick = async () => {
    // performMetamaskLogin();
    // await dispatch(setProvider(window.ethereum));

    await dispatch(switchToMetaMask());
    const result = await dispatch(getAutId(null));

    if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
      history.push('/role');
    }
  };

  return (
    <AutPageBox>
      <AutHeader logoId="new-user-logo" title=" WELCOME BACK" />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AutButton
          startIcon={
            <ButtonIcon>
              <Metamask />
            </ButtonIcon>
          }
          sx={{ mt: '29px' }}
          onClick={handleMetamaskClick}
        >
          Metamask
        </AutButton>
        <AutButton
          onClick={handleWalletConnectClick}
          startIcon={
            <ButtonIcon>
              <WalletConnect />
            </ButtonIcon>
          }
          sx={{ mt: '30px' }}
        >
          WalletConnect
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default LoginWithSkillWallet;
