import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { SmallerAutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { userData } from '../store/user-data.reducer';
import { SelectedNetwork } from '../store/wallet-provider';

const Congratulations: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const selectedNetwork = useSelector(SelectedNetwork);
  const userInput = useSelector(userData);

  const gotToShare = () => {
    history.push('share');
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
            You are now {userInput.roleName} in {autData.community.name}.
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
        <SmallerAutButton onClick={gotToShare} component="div">
          SHARE NOW
        </SmallerAutButton>
        <SmallerAutButton
          onClick={() => {
            window.open(`https://my.aut.id/${selectedNetwork}/${autData.tempUserData.username}`, '_blank');
          }}
        >
          SEE PROFILE
        </SmallerAutButton>
      </Box>
    </AutPageBox>
  );
};

export default Congratulations;
