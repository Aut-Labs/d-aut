import React, { useState } from 'react';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ReactComponent as Metamask } from '../assets/metamask.svg';
import { ReactComponent as WalletConnect } from '../assets/wallet-connect.svg';
import { AutBackButton } from '../components/AutBackButton';
import { useAppDispatch } from '../store/store.model';
import AutLogo from '../components/AutLogo';
import { AutButton, ButtonIcon } from '../components/AutButton';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { InternalErrorTypes } from '../utils/error-parser';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  // const performMetamaskLogin = async () => {};

  const handleMetamaskClick = async () => {
    // performMetamaskLogin();
    const result = await dispatch(getAutId(null));

    if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
      history.push('/role');
    }
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  return (
    <AutPageBox>
      <AutBackButton />
      <Box sx={{ mt: '16px' }}>
        <AutLogo id="default-logo" />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        WELCOME BACK
      </Typography>
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
          Login with MetaMaskg
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
          Use your password
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default LoginWithSkillWallet;
