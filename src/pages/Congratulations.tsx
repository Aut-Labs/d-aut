import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TwitterShareButton } from 'react-share';
import { AutButton, SmallerAutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, CustomCongratsMessage } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { IsOwner, userData } from '../store/user-data.reducer';
import { SelectedNetwork } from '../store/wallet-provider';

const Congratulations: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const customMessage = useSelector(CustomCongratsMessage);
  const isOwner = useSelector(IsOwner);
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
                  You have now claimed your ĀutID as owner of {autData.community?.name}!
                  <br /> You have also claimed your role as {userInput.roleName} and have been verified as an admin for this community.
                  <br />
                  <br /> Let it be known to the people of the Internet or check out your beautiful Self-Sovereign, Sybil-resistant NFT DID
                  in your public profile.
                  <br />
                  <br />
                  Reminder: Your identity isn't rare. It's unique.
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
            window.open(`https://my.aut.id/${userInput?.username}`, '_blank');
          }}
        >
          SEE PROFILE
        </AutButton>
      </Box>
    </AutPageBox>
  );
};

export default Congratulations;
