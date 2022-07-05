import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, styled, Typography } from '@mui/material';
import { community } from '../store/aut.reducer';
import BackButton from '../components/BackButton';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutBackButton } from '../components/AutBackButton';
import { AutPageBox } from '../components/AutPageBox';
import { FormWrapper } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';

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
      <AutHeader
        logoId="role-logo"
        title="WELCOME"
        subtitle={
          <>
            Pick what you’re the best at, <br /> & be rewarded for it!
          </>
        }
      />
      <FormWrapper>
        {communityData &&
          communityData.roles &&
          communityData.roles.map((role, n) => {
            return (
              <AutButton
                sx={{
                  '&.MuiButton-root': {
                    height: '55px',
                    '& + .MuiButton-root': {
                      mt: '30px',
                    },
                  },
                }}
                onClick={() => handleRoleSelect(role)}
                key={n}
              >
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
      </FormWrapper>
    </AutPageBox>
  );
};

export default UserRole;
