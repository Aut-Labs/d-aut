import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { autState, setSelectedAddress } from '../store/aut.reducer';
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
import { metaMaskConnector, walletConnectConnector } from '../services/ProviderFactory/web3.connectors';
import { SelectedNetworkConfig, setWallet } from '../store/wallet-provider';
import { useWeb3React } from '@web3-react/core';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';

// const provider = new WalletConnectProvider({
//   rpc: {
//     80001: 'https://matic-mumbai.chainstacklabs.com',
//   },
// });
const [metamaskConnector] = metaMaskConnector;
const [wcConnector] = walletConnectConnector;

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const autData = useSelector(autState);
  const networkConfig = useSelector(SelectedNetworkConfig);
  const history = useHistory();
  const { isActive, provider, account } = useWeb3React();

  // useEffect(() => {
  //   if (autData.provider && autData.isWalletConnect) {
  //     autData.provider.once('accountsChanged', async (accounts: string[]) => {
  //       await dispatch(setSelectedAddress(accounts[0]));

  //       const result = await dispatch(getAutId(null));
  //       if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
  //         history.push('/role');
  //       }
  //     });
  //   }
  // }, [autData.provider]);

  useEffect(() => {
    // console.log(isActive);
    const activate = async () => {
      if (isActive) {
        const res = await dispatch(setSelectedAddress(account));
        const result = await dispatch(getAutId(null));
        if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
          history.push('/role');
        }
      }
    };
    activate();
  }, [isActive]);

  const handleWalletConnectClick = async () => {
    await wcConnector.activate();
    await dispatch(setWallet('walletConnect'));
    await EnableAndChangeNetwork(wcConnector.provider, networkConfig.network);
  };

  const handleMetamaskClick = async () => {
    await metamaskConnector.activate();
    await dispatch(setWallet('metamask'));
    await EnableAndChangeNetwork(metamaskConnector.provider, networkConfig);

    // await dispatch(switchToMetaMask());
    // const result = await dispatch(getAutId(null));

    // if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
    //   history.push('/role');
    // }
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
