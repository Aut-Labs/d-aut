import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import AutLogo from '../components/AutLogo';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { useAppDispatch } from '../store/store.model';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { autState, setSelectedAddress } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { ErrorTypes } from '../types/error-types';
import { InternalErrorTypes } from '../utils/error-parser';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const autData = useSelector(autState);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchCommunity(null));
    };
    fetchData();
  }, []);

  const checkForExistingAutId = async () => {
    const hasAutId = await dispatch(checkIfAutIdExists(null));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      if (!hasAutId.payload) {
        history.push('userdetails');
      } else {
        history.push('role');
      }
    }
  };

  useEffect(() => {
    // Subscribe to accounts change
    if (autData.provider) {
      autData.provider.once('accountsChanged', async (accounts: string[]) => {
        await dispatch(setSelectedAddress(accounts[0]));

        await checkForExistingAutId();
      });
    }
  }, [autData.provider]);

  const handleWalletConnectClick = async () => {
    // if (autData.isWalletConnect) {
    //   if (autData.provider?.connected) {
    //     await dispatch(setSelectedAddress(autData.provider.accounts[0]));
    //     await checkForExistingAutId();
    //   } else {
    //     // autData.provider.isConnecting = false;
    //     // autData.provider.qrcodeModal.open('69');
    //     const wcProvider = await dispatch(resetWalletConnectThunk());
    //     (wcProvider.payload as WalletConnectProvider).enable();
    //   }
    // } else {
    //   const wcProvider = await dispatch(resetWalletConnectThunk());
    //   // await dispatch(setProvider(provider));
    //   (wcProvider.payload as WalletConnectProvider).enable();
    // }
    // const wcProvider = await dispatch(resetWalletConnectThunk());
    // (wcProvider.payload as WalletConnectProvider).enable();
  };

  const handleInjectFromMetamaskClick = async () => {
    // await dispatch(switchToMetaMask());
    await checkForExistingAutId();
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="new-user-logo"
        title="WELCOME"
        subtitle={
          <>
            First, import your wallet <br /> & claim your Role in{' '}
            <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span>
          </>
        }
      />
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
          onClick={handleInjectFromMetamaskClick}
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

export default NewUser;
