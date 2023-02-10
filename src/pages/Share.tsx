import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SmallerAutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { SelectedNetwork } from '../store/wallet-provider';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { LinkedinShareButton, TelegramShareButton, TwitterShareButton } from 'react-share';
import AutClipboardCopy from '../components/ClipboardCopy';
import { pxToRem } from '../utils/utils';
import { userData } from '../store/user-data.reducer';

const shareContent = (role, username, community, network) => {
  return `I'm now a ${role} @ ${community} 🎉\n
   Look at my self-sovereign AutID,\n
  and follow my journey 🖖\n 
  \n
    https://my.aut.id/${network}/${username}`;
};

const Share: React.FunctionComponent = () => {
  const autData = useSelector(autState);
  const userInput = useSelector(userData);
  const selectedNetwork = useSelector(SelectedNetwork);

  return (
    <AutPageBox>
      <AutHeader hideBackBtn logoId="new-user-logo" title="Show off your ĀutID" />
      <Typography textAlign="center" color="white" variant="subtitle2" sx={{ maxWidth: '300px', wordBreak: 'break-all' }}>
        I'm now a {userInput?.roleName} @ {autData.community?.name} 🎉
        <br />
        <br /> Look at my self-sovereign AutID,
        <br /> and follow my journey 🖖
        <br />
        <br /> https://my.aut.id/{selectedNetwork}/{userInput?.username}
      </Typography>

      <Typography color="white" variant="subtitle2" sx={{ mt: '43px', wordBreak: 'break-all' }}>
        SHARE YOUR ĀUTID:
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
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData?.username}`}
            className="social-button"
            summary={shareContent(userInput?.roleName, autData.tempUserData?.username, autData.community?.name, selectedNetwork)}
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
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData?.username}`}
            className="social-button"
            title={shareContent(userInput?.roleName, autData.tempUserData?.username, autData.community?.name, selectedNetwork)}
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
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData?.username}`}
            className="social-button"
            title={shareContent(userInput?.roleName, autData.tempUserData?.username, autData.community?.name, selectedNetwork)}
            hashtags={['Aut', 'DAO', 'Blockchain']}
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
