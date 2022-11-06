import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { autState, community } from '../store/aut.reducer';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';
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
      await dispatch(fetchCommunity());
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
      </FormWrapper>
    </AutPageBox>
  );
};

export default UserRole;
