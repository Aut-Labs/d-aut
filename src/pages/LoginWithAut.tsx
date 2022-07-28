import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { autState, setProvider } from '../store/aut.reducer';
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

const provider = new WalletConnectProvider({
  rpc: {
    1: 'https://matic-mumbai.chainstacklabs.com',
    2: 'https://rpc-mumbai.matic.today',
  },
});
const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const autData = useSelector(autState);
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  useEffect(() => {
    // Subscribe to accounts change
    if (autData.provider) {
      provider.once('accountsChanged', async (accounts: string[]) => {
        console.log(accounts);
        // console.log(provider);
        debugger;
        // [window.ethereum.selectedAddress] = accounts;
        // console.log(window.ethereum.selectedAddress);

        const result = await dispatch(getAutId(null));
        if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
          history.push('/role');
        }
      });

      // Subscribe to session disconnection
      provider.once('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
      });
    }
  }, [autData.provider]);

  const handleWalletConnectCLick = async () => {
    //  Enable session (triggers QR Code modal)

    debugger;
    await dispatch(setProvider(provider));

    await provider.enable();
  };

  const handleMetamaskClick = async () => {
    // performMetamaskLogin();
    debugger;
    await dispatch(setProvider(window.ethereum));

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
          onClick={handleWalletConnectCLick}
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
