import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import AutLogo from '../components/AutLogo';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { useAppDispatch } from '../store/store.model';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';
import { AutBackButton } from '../components/AutBackButton';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists } from '../services/web3/api';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const [metamaskSelected, setMetamaskSelected] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // const fetchData = async () => {};
    // fetchData();
  }, []);

  const handleInjectFromMetamaskClick = async () => {
    const idExists = await dispatch(checkIfAutIdExists(null));
    console.log(idExists.payload);
    if (!idExists.payload) {
      history.push('userdetails');
    }
  };

  return (
    <AutPageBox>
      <AutBackButton />
      <AutLogo id="default-logo" />
      <Typography sx={{ mt: '25px' }} variant="h3">
        WELCOME
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        First, import your wallet
      </Typography>
      <Typography variant="h4">Or create a brand new account</Typography>
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
          Inject from Metamask
        </AutButton>
        <AutButton
          startIcon={
            <ButtonIcon>
              <WalletConnect />
            </ButtonIcon>
          }
          disabled
          sx={{ mt: '30px' }}
        >
          Create Social Account
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default NewUser;
