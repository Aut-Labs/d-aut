import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { userData } from '../store/user-data.reducer';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { FormAction } from '../components/FormHelpers';
import { SelectedNetwork } from '../store/wallet-provider';

const MintSuccess: React.FunctionComponent = () => {
  const history = useHistory();
  const userInput = useSelector(userData);
  const selectedNetwork = useSelector(SelectedNetwork);
  const autData = useSelector(autState);

  return (
    <AutPageBox>
      <AutHeader hideBackBtn logoId="new-user-logo" title="Show off your ĀutID" />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', mt: '45px' }}>
          <Box sx={{ me: '8px', flex: '2', display: 'flex', justifyContent: 'end', height: '100%' }}>
            <Typography sx={{ maxWidth: '260px' }} variant="h4">
              I'm now a {userInput.roleName} @ {autData.community.name} 🎉
              <br />
              <br /> Look at my self-sovereign AutID,
              <br /> and follow my journey 🖖
              <br />
              <br /> https://my.aut.id/{selectedNetwork}/{userInput.username}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: '1',
              display: 'flex',
              justifyContent: 'start',
              maxHeight: '140px',
            }}
          >
            <Box
              component="img"
              sx={{
                objectFit: 'contain',
                maxWidth: '85px',
              }}
              alt="User image."
              // Make this not the badge
              src={userInput.badge}
            />
          </Box>
        </Box>
        <TwitterShareButton
          url={`https://my.aut.id/${selectedNetwork}/${userInput.username}`}
          title={`I'm now a ${userInput.roleName} in ${autData.community.name} 🎉
Look at my self-sovereign ĀutID,
and follow my journey 🖖`}
          hashtags={['Aut', 'DAO', 'Blockchain']}
          className="social-button"
        >
          <AutButton
            sx={{
              marginBottom: '30px',
            }}
          >
            Share
          </AutButton>
        </TwitterShareButton>
      </Box>
    </AutPageBox>
  );
};

export default MintSuccess;
