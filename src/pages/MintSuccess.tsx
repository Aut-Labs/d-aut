import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { userData } from '../store/user-data.reducer';

const MintSuccess: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const userInput = useSelector(userData);

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
        <AutHeader logoId="new-user-logo" title="Show off your ĀutID" />
        <Box
          sx={{
            height: '100%',
          }}
        >
          SOME CONTENT HERE
        </Box>
        <AutButton onClick={handleAutIdClicked}>Share</AutButton>
      </Box>
    </AutPageBox>
  );
};

export default MintSuccess;
