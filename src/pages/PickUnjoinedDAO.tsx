import React, { useEffect } from 'react';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, setSelectedUnjoinedCommunity } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';
import { Controller, useForm } from 'react-hook-form';
import { FormAction, FormWrapper, FormContent } from '../components/FormHelpers';
import { AutSelectField, FormHelperText } from '../components/Fields';
import { useAppDispatch } from '../store/store.model';

const errorTypes = {
  validAddress: `Not a valid address`,
  selected: 'Field is required!',
};

const PickUnjoinedDAO: React.FunctionComponent = () => {
  const history = useHistory();
  const autData = useSelector(autState);
  const dispatch = useAppDispatch();
  const { connector } = useWeb3React();
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      dao: null,
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    await dispatch(setSelectedUnjoinedCommunity(data.dao));
    history.push('/role');
  };

  const onBackClicked = async () => {
    await dispatch(setSelectedUnjoinedCommunity(null));
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
        <AutHeader backAction={onBackClicked} logoId="unjoined-logo" title="Pick DAO to join." />
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
                    width="450"
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText value={value} name={name} errors={formState.errors} />}
                  >
                    {autData.unjoinedCommunities.map((dao) => (
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
