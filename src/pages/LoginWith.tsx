import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';

const LoginWith: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);

  const handleAutIdClicked = () => {
    history.push('autid');
  };

  const handleNewUserClicked = () => {
    history.push('newuser');
  };

  return (
    <AutPageBox>
      <AutHeader hideBackBtn logoId="login-with-logo" title="Login or Sign-up" />
      <AutButton
        color="white"
        size="normal"
        variant="outlined"
        sx={{ textTransform: 'none', mt: autData.daoExpanderAddress ? '93px' : '133px' }}
        onClick={handleAutIdClicked}
      >
        CONNECT WITH ĀutID
      </AutButton>
      {autData.daoExpanderAddress && (
        <AutButton color="white" size="normal" variant="outlined" sx={{ mt: '53px' }} onClick={handleNewUserClicked}>
          NEW USER
        </AutButton>
      )}
    </AutPageBox>
  );
};

export default LoginWith;
