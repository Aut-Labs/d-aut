import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { setUserData, userData } from '../store/user-data.reducer';
import { useAppDispatch } from '../store/store.model';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState } from '../store/aut.reducer';
import { FormAction, FormContent, FormWrapper } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';
import { AutCommitmentSlider } from '../theme/commitment-slider-styles';
import { useAutConnectorContext } from '..';
import { joinHub, mintMembership } from '../services/web3/api';

const Commitment: React.FunctionComponent = (props) => {
  const navigate = useNavigate();
  const userInput = useSelector(userData);
  const coreState = useSelector(autState);
  const dispatch = useAppDispatch();
  const { state } = useAutConnectorContext();

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
    if (coreState.justJoin) {
      const result = await dispatch(joinHub(state.address));
      if (!(result as any).error) {
        navigate('/congrats');
      }
    } else {
      const result = await dispatch(mintMembership(state.address));
      if (!(result as any).error) {
        navigate('/congrats');
      }
    }
  };

  return (
    <AutPageBox>
      <AutHeader
        logoId="commitment-logo"
        title={
          // <>
          //   You picked<span style={{ fontStyle: 'italic' }}> {userInput.roleName}</span>
          // </>
          <>Your Level of Commitment</>
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
            rules={{ required: true, min: coreState.hub.properties.minCommitment, max: 10 }}
            render={({ field: { name, value, onChange } }) => (
              <AutCommitmentSlider
                hubName={coreState.hub.name}
                minCommitment={coreState.hub.properties.minCommitment}
                value={value}
                name={name}
                sx={{ mt: '63px' }}
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
          <AutButton
            size="normal"
            sx={{
              whiteSpace: 'nowrap',
            }}
            variant="outlined"
            type="submit"
            disabled={!isValid}
          >
            JOIN THE HUB
          </AutButton>
        </FormAction>
      </FormWrapper>
    </AutPageBox>
  );
};

export default Commitment;
