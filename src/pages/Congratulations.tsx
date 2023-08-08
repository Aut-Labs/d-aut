import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, CustomCongratsMessage, UsingDev } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { IsOwner, userData } from '../store/user-data.reducer';
import { SelectedNetwork } from '../store/wallet-provider';
import { autUrls } from '../services/web3/env';

const Congratulations: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const autData = useSelector(autState);
  const customMessage = useSelector(CustomCongratsMessage);
  const isOwner = useSelector(IsOwner);
  const userInput = useSelector(userData);
  const isDev = useSelector(UsingDev);

  const gotToShare = () => {
    navigate('share');
  };

  return (
    <AutPageBox>
      <AutHeader
        hideBackBtn
        logoId="new-user-logo"
        title="CONGRATS 🎉"
        subtitle={
          customMessage ? (
            <>
              <br />
              <br />
              <br />
              {customMessage}
            </>
          ) : (
            <>
              {isOwner ? (
                <>
                  You’re now a {userInput.roleName} @ {autData.community?.name}🎉
                  <br /> Your ĀutID is the first identity that you truly own - cause your Identity is not rare. It’s unique.
                  <br />
                  <br /> Look at your self-sovereign ĀutID, and share your journey 🖖
                </>
              ) : (
                <>
                  <br />
                  <br />
                  You are now {userInput.roleName} in {autData.community?.name}.
                  <br /> Let it be known to the people of the Internet
                  <br /> or check out your beautiful NFT ID in your public profile.
                  <br />
                  <br />
                  Reminder: Your identity isn't rare. It's unique.
                </>
              )}
            </>
          )
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
          mb: '60px',
        }}
      >
        <AutButton size="half" variant="outlined" onClick={gotToShare}>
          SHARE
        </AutButton>
        <AutButton
          size="half"
          variant="outlined"
          onClick={() => {
            window.open(`${autUrls(isDev).myAut}${userInput?.username}`, '_blank');
          }}
        >
          SEE PROFILE
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default Congratulations;
