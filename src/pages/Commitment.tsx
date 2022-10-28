import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { setUserData, userData } from '../store/user-data.reducer';
import { useAppDispatch } from '../store/store.model';
import { joinCommunity, mintMembership } from '../services/web3/api';
import { AutSlider } from '../components/CommitmentSlider';
import { AutButton } from '../components/AutButton';
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
    // console.log(data);
    if (coreState.justJoin) {
      const result = await dispatch(joinCommunity(null));
      if (!(result as any).error) {
        history.push('congrats');
      }
    } else {
      const result = await dispatch(mintMembership(null));
      if (!(result as any).error) {
        history.push('mintsuccess');
      }
    }
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="commitment-logo"
        title={
          <>
            You picked<span style={{ fontStyle: 'italic' }}> {userInput.roleName}</span>
          </>
        }
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
            rules={{ required: true, min: coreState.community.minCommitment, max: 10 }}
            render={({ field: { name, value, onChange } }) => (
              <AutSlider
                communityName={coreState.community.name}
                minCommitment={coreState.community.minCommitment}
                value={value}
                name={name}
                errors={errors as any}
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
