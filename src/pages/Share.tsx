import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { AutPageBox } from '../components/AutPageBox';
import { UsingDev, autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { SelectedNetwork } from '../store/wallet-provider';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { LinkedinShareButton, TelegramShareButton, TwitterShareButton } from 'react-share';
import { userData } from '../store/user-data.reducer';
import { autUrls } from '../services/web3/env';

const shareContent = (role: string, username: string, hub: string) => {
  return `I'm now a ${role} @ ${hub} 🎉\nLook at my self-sovereign ĀutID,\nand follow my journey 🖖`;
};

const Share: React.FunctionComponent = () => {
  const autData = useSelector(autState);
  const userInput = useSelector(userData);
  const selectedNetwork = useSelector(SelectedNetwork);
  const isDev = useSelector(UsingDev);

  return (
    <AutPageBox>
      <AutHeader hideBackBtn logoId="new-user-logo" title="Show off your ĀutID" />
      <Typography textAlign="center" color="white" variant="subtitle2" sx={{ maxWidth: '300px', wordBreak: 'break-all' }}>
        I'm now a {userInput?.roleName} @ {autData.hub?.name} 🎉
        <br />
        <br />
        Look at my self-sovereign ĀutID,
        <br />
        and follow my journey 🖖
        <br />
        <br />
        {autUrls(isDev).myAut}
        {userInput?.username}
      </Typography>

      <Typography color="white" variant="subtitle2" sx={{ mt: '43px', wordBreak: 'break-all' }}>
        SHARE YOUR ĀutID:
      </Typography>
      <Box
        sx={{
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          mt: 'auto',
          mb: '60px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            mt: 'auto',
          }}
        >
          <LinkedinShareButton
            url={`${autUrls(isDev).myAut}${userInput?.username}`}
            className="social-button"
            summary={shareContent(userInput?.roleName, userInput?.username, autData.hub?.name)}
            title="My ĀutID"
          >
            <LinkedInIcon
              color="primary"
              sx={{
                color: '#FFF',
                width: '55px',
                height: '55px',
              }}
            />
          </LinkedinShareButton>
          <TelegramShareButton
            url={`${autUrls(isDev).myAut}${userInput?.username}`}
            className="social-button"
            title={shareContent(userInput?.roleName, userInput?.username, autData.hub?.name)}
          >
            <TelegramIcon
              sx={{
                color: '#FFF',
                width: '55px',
                height: '55px',
              }}
            />
          </TelegramShareButton>
          <TwitterShareButton
            url={`${autUrls(isDev).myAut}${userInput?.username}`}
            className="social-button"
            title={shareContent(userInput?.roleName, userInput?.username, autData.hub?.name)}
            hashtags={['Aut', 'Hub']}
          >
            <TwitterIcon
              color="primary"
              sx={{
                color: '#FFF',
                width: '55px',
                height: '55px',
              }}
            />
          </TwitterShareButton>
        </Box>
      </Box>
    </AutPageBox>
  );
};

export default Share;
