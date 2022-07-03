import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { community } from '../store/aut.reducer';
import BackButton from '../components/BackButton';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutBackButton } from '../components/AutBackButton';
import { AutPageBox } from '../components/AutPageBox';

const UserRole: React.FunctionComponent = (props) => {
  const dipsatch = useAppDispatch();
  const history = useHistory();
  const communityData = useSelector(community);

  //  const onSubmit = async (data: any) => {};

  useEffect(() => {
    const fetchData = async () => {
      dipsatch(fetchCommunity(null));
      console.log('use Effect');
    };
    fetchData();
  }, []);

  const handleRoleSelect = (role) => {
    dipsatch(setUserData({ role: role.id, roleName: role.roleName }));
    history.push('commitment');
  };

  const handleBackClick = async () => {
    history.goBack();
  };

  return (
    <AutPageBox>
      <AutBackButton />
      <Box>
        <AutLogo id="default-logo" />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        WELCOME
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        Pick what you’re the best at,
      </Typography>
      <Typography variant="h4">& be rewarded for it!</Typography>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          mb: '9px',
        }}
      >
        {communityData &&
          communityData.roles &&
          communityData.roles.map((role, n) => {
            return (
              <AutButton sx={{ mt: '30px' }} onClick={() => handleRoleSelect(role)} key={n}>
                {role.roleName}
              </AutButton>
            );
          })}
        {/* <SwButton
          sx={{
            borderColor: 'primary.main',
          }}
          btnType="large"
          mode="dark"
          component={Button}
          type="submit"
          disabled={!selectedRole}
          label="That's it - join this community!"
        /> */}
      </Box>
    </AutPageBox>
  );
};

export default UserRole;
