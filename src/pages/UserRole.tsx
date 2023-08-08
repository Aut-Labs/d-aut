import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AllowedRoleId, community } from '../store/aut.reducer';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';
import { setUserData } from '../store/user-data.reducer';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { FormWrapper } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';

const UserRole: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const allowedRole = useSelector(AllowedRoleId);
  const communityData = useSelector(community);

  const handleRoleSelect = (role) => {
    dispatch(setUserData({ role: role.id, roleName: role.roleName }));
    navigate('commitment');
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
    // if (autData.justJoin) {
    //   if (connector) {
    //     await connector.deactivate();
    //   }
    // }
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="role-logo"
        title="Your Role"
        backAction={deactivateConnector}
        subtitle={<>Pick what you’re the best at, & be rewarded for it!</>}
      />
      <FormWrapper>
        {communityData &&
          communityData.roles &&
          communityData.roles.map((role, n) => {
            return (
              <AutButton
                size="normal"
                variant="outlined"
                // eslint-disable-next-line eqeqeq
                disabled={allowedRole && !(role.id == allowedRole)}
                sx={{
                  mt: '30px',
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
