import React from 'react';
import { Box, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, setSelectedUnjoinedHubAddress } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { Controller, useForm } from 'react-hook-form';
import { FormAction, FormWrapper, FormContent } from '../components/FormHelpers';
import { AutSelectField, FormHelperText } from '../components/Fields';
import { useAppDispatch } from '../store/store.model';
import { fetchHub } from '../services/web3/api';

const PickUnjoinedHub: React.FunctionComponent = () => {
  const autData = useSelector(autState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      hub: autData.selectedUnjoinedHubAddress,
    },
  });

  const onSubmit = async (data: any) => {
    await dispatch(setSelectedUnjoinedHubAddress(data.hub));
    await dispatch(fetchHub());
    navigate('/role');
  };

  const onBackClicked = async () => {
    await dispatch(setSelectedUnjoinedHubAddress(null));
  };

  return (
    <AutPageBox>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AutHeader
          backAction={onBackClicked}
          logoId="unjoined-logo"
          title="Pick Hub to join."
          subtitle={
            <>
              You have integrated these Hubs
              <br />
              but haven't joined them.
            </>
          }
        />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <FormContent>
            <Controller
              name="hub"
              control={control}
              rules={{
                validate: {
                  selected: (v: string) => !!v,
                },
              }}
              render={({ field: { name, value, onChange } }) => {
                return (
                  <AutSelectField
                    variant="standard"
                    autoFocus
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText name={name} errors={formState.errors} />}
                  >
                    {autData.unjoinedHubs &&
                      autData.unjoinedHubs.map((hub) => (
                        <MenuItem key={`hub-${hub.properties.address}`} color="primary" value={hub.properties.address}>
                          {hub.name}
                        </MenuItem>
                      ))}
                  </AutSelectField>
                );
              }}
            />
          </FormContent>
          <FormAction>
            <AutButton type="submit" disabled={!formState.isValid}>
              Join Hub
            </AutButton>
          </FormAction>
        </FormWrapper>
      </Box>
    </AutPageBox>
  );
};

export default PickUnjoinedHub;
