import React from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import AutLogo from '../components/AutLogo';
import { AutButton, SmallerAutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { pxToRem } from '../services/web3/utils';
import { userData } from '../store/user-data.reducer';
import { SelectedNetwork } from '../store/wallet-provider';

const Congratulations: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const selectedNetwork = useSelector(SelectedNetwork);
  const userInput = useSelector(userData);

  const handleShareClicked = () => {
    // console.log('SHARE');
  };

  const handleSeeProfile = () => {
    // console.log('Seeprofile');
  };

  return (
    <AutPageBox>
      <AutHeader
        hideBackBtn
        logoId="new-user-logo"
        title="CONGRATS 🎉"
        subtitle={
          <>
            <br />
            <br />
            You are now a {userInput.roleName} in {autData.community.name}.
            <br /> Let it be known to the people of the Internet
            <br /> or check out your beautiful NFT ID in your public profile.
            <br />
            <br />
            <span style={{ textDecoration: 'underline' }}>Reminder:</span> Your identity isn't rare. It's unique.
          </>
        }
      />
      <Box
        sx={{
          width: '90%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          mt: 'auto',
          mb: '30px',
        }}
      >
        <TwitterShareButton
          url={`https://my.aut.id/${selectedNetwork}/${userInput.username}`}
          title={`I just joined ${autData.community.name}. Check out my AutId!`}
          hashtags={['Aut', 'DAO', 'Blockchain']}
          className="social-button"
        >
          <SmallerAutButton component="div">SHARE NOW</SmallerAutButton>
        </TwitterShareButton>
        {/* <SmallerAutButton onClick={handleShareClicked}>SHARE</SmallerAutButton> */}
        <SmallerAutButton
          onClick={() => {
            window.open('https://www.google.com', '_blank');
          }}
        >
          SEE PROFILE
        </SmallerAutButton>
      </Box>
    </AutPageBox>
  );
};

export default Congratulations;
