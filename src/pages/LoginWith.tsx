import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { useEthers } from '@usedapp/core';

const LoginWith: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const { deactivate } = useEthers();

  const handleAutIdClicked = () => {
    history.push('autid');
  };

  const handleNewUserClicked = () => {
    history.push('newuser');
  };

  useEffect(() => {
    deactivate();
  }, []);

  return (
    <AutPageBox>
      <AutHeader hideBackBtn logoId="login-with-logo" title="Login of Sign-up" />
      <AutButton
        color="white"
        size="normal"
        variant="outlined"
        sx={{ mt: autData.daoExpanderAddress ? '93px' : '133px' }}
        onClick={handleAutIdClicked}
      >
        Connect with āutID
      </AutButton>
      {autData.daoExpanderAddress && (
        <AutButton color="white" size="normal" variant="outlined" sx={{ mt: '53px' }} onClick={handleNewUserClicked}>
          New User
        </AutButton>
      )}
    </AutPageBox>
  );
};

export default LoginWith;
