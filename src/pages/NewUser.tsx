import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { autState, setJustJoining, setSelectedAddress } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
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
        await dispatch(setJustJoining(false));
        history.push('userdetails');
      } else {
        await dispatch(setJustJoining(true));
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
    // console.log(isActive);
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
  };

  const handleInjectFromMetamaskClick = async () => {
    await metamaskConnector.activate();
    await dispatch(setWallet('metamask'));
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
