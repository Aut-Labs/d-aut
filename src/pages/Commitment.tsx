import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import BackButton from '../components/BackButton';
import { setUserData, userData } from '../store/user-data.reducer';
import { useAppDispatch } from '../store/store.model';
import { joinCommunity, mintMembership } from '../services/web3/api';
import AutLogo from '../components/AutLogo';
import { AutSlider } from '../components/CommitmentSlider';
import { AutButton } from '../components/AutButton';
import { AutBackButton } from '../components/AutBackButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';

interface Role {
  roleId: number;
  roleName: string;
}

const Commitment: React.FunctionComponent = (props) => {
  const history = useHistory();
  const userInput = useSelector(userData);
  const coreState = useSelector(autState);
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: userInput,
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    if (coreState.justJoin) {
      dispatch(joinCommunity({ userData: userInput, commitment: data.commitment }));
    } else {
      dispatch(mintMembership({ userData: userInput, commitment: data.commitment }));
    }
  };

  return (
    <AutPageBox>
      <AutBackButton />
      <Box>
        <AutLogo id="default-logo" />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        YOU PICKED {userInput.roleName}
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        Tell your community how much
      </Typography>
      <Typography variant="h4">Time you can commit to this role</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: '56px' }}>
          <Controller
            name="commitment"
            control={control}
            rules={{ required: true, min: 1, max: 10 }}
            render={({ field: { name, value, onChange } }) => (
              <AutSlider
                value={value}
                name={name}
                errors={errors}
                sliderProps={{
                  defaultValue: 0,
                  step: 1,
                  marks: true,
                  onChange(event, value, activeThumb) {
                    dispatch(setUserData({ commitment: value }));
                    onChange(value);
                  },
                  name,
                  value: value || 0,
                  min: 0,
                  max: 10,
                }}
              />
              // <Slider
              //   min={0}
              //   max={10}
              //   onChange={(e, v) => {
              //     console.log(v);
              //     return onChange(v);
              //   }}
              //   value={value}
              // />
            )}
          />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <AutButton sx={{ mt: '56px' }} type="submit" disabled={!isValid}>
            Join the Community
          </AutButton>
        </Box>
      </form>
    </AutPageBox>
  );
};

export default Commitment;
