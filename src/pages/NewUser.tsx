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
import { metaMaskConnector, walletConnectConnector } from '../services/ProviderFactory/web3.connectors';
import { useWeb3React } from '@web3-react/core';
import { SelectedNetworkConfig, setWallet } from '../store/wallet-provider';

const [metamaskConnector] = metaMaskConnector;
const [wcConnector] = walletConnectConnector;

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const networkConfig = useSelector(SelectedNetworkConfig);
  const autData = useSelector(autState);
  const history = useHistory();
  const { isActive, account, connector } = useWeb3React();

  const checkForExistingAutId = async () => {
    const hasAutId = await dispatch(checkIfAutIdExists(null));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity(null));
      if (!hasAutId.payload) {
        history.push('userdetails');
      } else {
        history.push('role');
      }
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     dispatch(fetchCommunity(null));
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    console.log(isActive);
    const activate = async () => {
      if (isActive) {
        const res = await dispatch(setSelectedAddress(account));
        checkForExistingAutId();
      }
    };
    activate();
  }, [isActive]);

  const handleWalletConnectClick = async () => {
    await wcConnector.activate();
    await dispatch(setWallet('walletConnect'));
    await EnableAndChangeNetwork(wcConnector.provider, networkConfig.network);
  };

  const handleInjectFromMetamaskClick = async () => {
    await metamaskConnector.activate();
    await dispatch(setWallet('injected'));
    await EnableAndChangeNetwork(metamaskConnector.provider, networkConfig);
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="new-user-logo"
        title="WELCOME"
        subtitle={
          <>
            First, import your wallet <br /> & claim your Role in your DAO
            {/* <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span> */}
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
