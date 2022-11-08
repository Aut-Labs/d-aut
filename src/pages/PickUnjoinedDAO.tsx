import React from 'react';
import { Box, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, setSelectedUnjoinedCommunityAddress } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';
import { Controller, useForm } from 'react-hook-form';
import { FormAction, FormWrapper, FormContent } from '../components/FormHelpers';
import { AutSelectField, FormHelperText } from '../components/Fields';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity } from '../services/web3/api';

const PickUnjoinedDAO: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const dispatch = useAppDispatch();
  const { connector } = useWeb3React();
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      dao: autData.selectedUnjoinedCommunityAddress,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    await dispatch(setSelectedUnjoinedCommunityAddress(data.dao));
    await dispatch(fetchCommunity());
    history.push('/role');
  };

  const onBackClicked = async () => {
    if (connector) {
      await connector.deactivate();
    }
    await dispatch(setSelectedUnjoinedCommunityAddress(null));
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
          title="Pick DAO to join."
          subtitle={
            <>
              You have integrated these DAOs
              <br />
              but haven't joined them.
            </>
          }
        />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <FormContent>
            <Controller
              name="dao"
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
                    renderValue={(selected) => {
                      if (!selected) {
                        return 'Select DAO';
                      }
                      const dao = autData.unjoinedCommunities.find((t) => t.address === selected);
                      return dao?.name || selected;
                    }}
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText name={name} errors={formState.errors} />}
                  >
                    {autData.unjoinedCommunities &&
                      autData.unjoinedCommunities.map((dao) => (
                        <MenuItem key={`dao-${dao.address}`} color="primary" value={dao.address}>
                          {dao.name}
                        </MenuItem>
                      ))}
                  </AutSelectField>
                );
              }}
            />
          </FormContent>
          <FormAction>
            <AutButton type="submit" disabled={!formState.isValid}>
              Join DAO
            </AutButton>
          </FormAction>
        </FormWrapper>
      </Box>
    </AutPageBox>
  );
};

export default PickUnjoinedDAO;
