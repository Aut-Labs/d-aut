import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, Slider, styled, Typography } from '@mui/material';
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
import { FormAction, FormContent, FormWrapper } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';

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
      // TODO : Use user input from the store
      const result = await dispatch(joinCommunity({ userData: userInput, commitment: data.commitment }));
      history.push('congrats');
    } else {
      const result = await dispatch(mintMembership({ userData: userInput, commitment: data.commitment }));
      history.push('minted');
    }
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="commitment-logo"
        title={`You picked ${userInput.roleName}`}
        subtitle={
          <>
            Tell your community how much <br /> time you can commit to this role
          </>
        }
      />
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormContent>
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
            )}
          />
        </FormContent>
        <FormAction>
          <AutButton type="submit" disabled={!isValid}>
            Join the Community
          </AutButton>
        </FormAction>
      </FormWrapper>
    </AutPageBox>
  );
};

export default Commitment;
