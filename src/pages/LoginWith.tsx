import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';

const LoginWith: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const { connector } = useWeb3React();

  useEffect(() => {
    const resetConnection = async () => {
      await connector.deactivate();
    };
    if (connector) {
      resetConnection();
    }
  });

  const handleAutIdClicked = () => {
    history.push('autid');
  };

  const handleNewUserClicked = () => {
    history.push('newuser');
  };

  return (
    <AutPageBox>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AutHeader hideBackBtn hideCloseBtn logoId="login-with-logo" title="LOGIN OR SIGN-UP" />
        <AutButton sx={{ mt: autData.communityExtensionAddress ? '48px' : '78px' }} onClick={handleAutIdClicked}>
          Connect with āutID
        </AutButton>
        {autData.communityExtensionAddress && (
          <AutButton sx={{ mt: '30px' }} onClick={handleNewUserClicked}>
            New User
          </AutButton>
        )}
      </Box>
    </AutPageBox>
  );
};

export default LoginWith;
