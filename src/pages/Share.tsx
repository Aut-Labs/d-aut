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
import { pxToRem } from '../services/web3/utils';

const Share: React.FunctionComponent = () => {
  const autData = useSelector(autState);
  const selectedNetwork = useSelector(SelectedNetwork);

  return (
    <AutPageBox>
      <AutHeader
        hideBackBtn
        logoId="new-user-logo"
        title="SHARE ON SOCIALS"
        subtitle={
          <>
            <br />
            Let the world know about this.
            <br />
          </>
        }
      />
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
            gap: pxToRem(56),
            mt: 'auto',
          }}
        >
          <LinkedinShareButton
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData.username}`}
            className="social-button"
            summary={`I just joined ${autData.community.name}. Check out my ĀutId!`}
            title="My ĀutID"
          >
            <LinkedInIcon
              sx={{
                width: '65px',
                height: '65px',
                color: 'white',
              }}
            />
          </LinkedinShareButton>
          <TelegramShareButton
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData.username}`}
            className="social-button"
            title={`I just joined ${autData.community.name}. Check out my ĀutId!`}
          >
            <TelegramIcon
              sx={{
                width: '65px',
                height: '65px',
                color: 'white',
              }}
            />
          </TelegramShareButton>
          <TwitterShareButton
            url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData.username}`}
            className="social-button"
            title={`I just joined ${autData.community.name}. Check out my ĀutId!`}
            hashtags={['Aut', 'DAO', 'Blockchain']}
          >
            <TwitterIcon
              sx={{
                width: '65px',
                height: '65px',
                color: 'white',
              }}
            />
          </TwitterShareButton>
        </Box>
        <div
          className="copy-link"
          style={{
            width: '330px',
          }}
        >
          <Typography sx={{ fontSize: '14px' }} color="white" fontSize={pxToRem(18)}>
            Copy link
          </Typography>
          <AutClipboardCopy url={`https://my.aut.id/${selectedNetwork}/${autData.tempUserData.username}`} />
        </div>
      </Box>
    </AutPageBox>
  );
};

export default Share;
