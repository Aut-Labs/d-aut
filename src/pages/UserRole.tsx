import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, styled, Typography } from '@mui/material';
import { autState, community } from '../store/aut.reducer';
import BackButton from '../components/BackButton';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { FormWrapper } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';

const UserRole: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { connector } = useWeb3React();
  const autData = useSelector(autState);
  const communityData = useSelector(community);

  const handleRoleSelect = (role) => {
    dispatch(setUserData({ role: role.id, roleName: role.roleName }));
    history.push('commitment');
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchCommunity(null));
    };
    if (!communityData) {
      fetchData();
    }
  }, []);

  const deactivateConnector = async () => {
    if (autData.justJoin) {
      if (connector) {
        await connector.deactivate();
      }
    }
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="role-logo"
        title="WELCOME"
        backAction={deactivateConnector}
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
