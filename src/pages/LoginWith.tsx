import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';

const LoginWith: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const autData = useSelector(autState);

  const handleAutIdClicked = () => {
    navigate('autid');
  };

  const handleNewUserClicked = () => {
    navigate('newuser');
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
