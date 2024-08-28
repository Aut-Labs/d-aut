import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { TwitterShareButton } from 'react-share';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { userData } from '../store/user-data.reducer';
import { UsingDev, autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { autUrls } from '../services/web3/env';

const MintSuccess: React.FunctionComponent = () => {
  const userInput = useSelector(userData);
  const autData = useSelector(autState);
  const isDev = useSelector(UsingDev);

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
            <Typography sx={{ maxWidth: '260px', wordBreak: 'break-all' }} variant="h4">
              I'm now a {userInput.roleName} @ {autData.hub.name} 🎉
              <br />
              <br />
              Look at my self-sovereign ĀutID,
              <br />
              and follow my journey 🖖
              <br />
              <br />
              {autUrls(isDev).myAut}
              {userInput.username}
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
          url={`${autUrls(isDev).myAut}${userInput.username}`}
          title={`I'm now a ${userInput.roleName} in ${autData.hub.name} 🎉
Look at my self-sovereign ĀutID,
and follow my journey 🖖`}
          hashtags={['Aut', 'Hub']}
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
