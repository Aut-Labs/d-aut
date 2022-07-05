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

const Congratulations: React.FunctionComponent = () => {
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
        <AutHeader
          logoId="new-user-logo"
          title="CONGRATS 🎉"
          subtitle={
            <>
              You are now a {userInput.roleName} in {autData.community.name}.
              <br /> Let it be known to the people of the Internet
              <br /> or check out your beautiful NFT ID in your public profile.
              <br />
              <span style={{ textDecoration: 'underline' }}>Reminder: </span> Your identity isn't rare. It's unique.
            </>
          }
        />
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <AutButton onClick={handleAutIdClicked}>Share</AutButton>
          <AutButton>SEE PROFILE</AutButton>
        </Box>
      </Box>
    </AutPageBox>
  );
};

export default Congratulations;
