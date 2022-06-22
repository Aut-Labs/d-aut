import React, { useState } from 'react';
import { SwButton } from 'sw-web-shared';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ReactComponent as MetaMaskIcon } from '../assets/metamask.svg';

import BackButton from '../components/BackButton';
import { useAppDispatch } from '../store/store.model';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errorData, setErrorData] = useState(undefined);

  // const performMetamaskLogin = async () => {};

  const handleMetamaskClick = async () => {
    // performMetamaskLogin();
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            mx: '2px',
          }}
        >
          <BackButton handleClick={handleBackClick} />
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
            }}
          >
            <Typography align="center" variant="h1" sx={{ my: 'auto', fontWeight: '400' }}>
              Welcome back! 🙌
            </Typography>
          </Box>
          <Box
            sx={{
              width: '45px',
              height: '45px',
            }}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
          }}
        >
          <SwButton
            sx={{
              borderColor: 'primary.main',
            }}
            btnType="large"
            startIcon={<MetaMaskIcon />}
            mode="dark"
            onClick={handleMetamaskClick}
            label="Login with Metamask"
          />
          <SwButton
            sx={{
              borderColor: 'primary.main',
            }}
            btnType="large"
            disabled
            mode="dark"
            component={Link}
            to="/qr"
            label="Scan QR Code"
          />
        </Box>
      </>
    </Box>
  );
};

export default LoginWithSkillWallet;