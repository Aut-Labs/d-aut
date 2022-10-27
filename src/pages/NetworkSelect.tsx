import React, { useEffect } from 'react';
import { Box, Button, MenuItem, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import {
  autState,
  ResultState,
  setSelectedAddress,
  setSelectedUnjoinedCommunityAddress,
  setStatus,
  updateErrorState,
} from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';
import { Controller, useForm } from 'react-hook-form';
import { FormAction, FormWrapper, FormContent } from '../components/FormHelpers';
import { AutSelectField, FormHelperText } from '../components/Fields';
import { useAppDispatch } from '../store/store.model';
import { fetchCommunity, getAutId } from '../services/web3/api';
import { AutId } from '../services/ProviderFactory/web3.connectors';
import { IsConnected, NetworksConfig, SelectedNetwork, setSelectedNetwork } from '../store/wallet-provider';
import { Connector } from '@web3-react/types';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';
import { InternalErrorTypes } from '../utils/error-parser';

const NetworkSelect: React.FunctionComponent = () => {
  const history = useHistory();
  const networkConfigs = useSelector(NetworksConfig);
  const autData = useSelector(autState);
  const selectedNetwork = useSelector(SelectedNetwork);
  const dispatch = useAppDispatch();
  const { isActive, account, connector } = useWeb3React();
  const isConnected = useSelector(IsConnected);
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      network: selectedNetwork,
    },
  });

  const checkNetwork = async (selectedNetwork) => {
    const network = networkConfigs.find((n) => n.network === selectedNetwork);
    // @ts-ignore
    const foundChainId = Number(connector?.provider?.chainId);
    if (foundChainId === network.chainId) {
      await dispatch(getAutId(null));
    } else {
      await dispatch(setSelectedNetwork(network.network));
      try {
        await EnableAndChangeNetwork(connector.provider, network);
      } catch (e) {
        await dispatch(setStatus(ResultState.Failed));
        dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      }
      await dispatch(getAutId(null));
    }
  };

  const onSubmit = async (data: any) => {
    await dispatch(setStatus(ResultState.Loading));
    await checkNetwork(data.network);
  };

  const onBackClicked = async () => {
    await dispatch(setSelectedNetwork(null));
    if (connector) {
      await connector.deactivate();
    }
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
          logoId="networks-logo"
          title="Pick a network to connect."
          subtitle={
            <>
              Your address has ĀutIDs on
              <br />
              multiple networks.
            </>
          }
        />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <FormContent>
            <Controller
              name="network"
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
                        return 'Select Network';
                      }
                      const autId = autData.autIdsOnDifferentNetworks.find((a) => a.network === selected);
                      return autId?.network || selected;
                    }}
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText value={value} name={name} errors={formState.errors} />}
                  >
                    {autData.autIdsOnDifferentNetworks &&
                      autData.autIdsOnDifferentNetworks.map((autId) => (
                        <MenuItem key={`autId-${autId.network}`} color="primary" value={autId.network}>
                          {autId.network}
                        </MenuItem>
                      ))}
                  </AutSelectField>
                );
              }}
            />
          </FormContent>
          <FormAction>
            <AutButton type="submit" disabled={!formState.isValid}>
              Connect
            </AutButton>
          </FormAction>
        </FormWrapper>
      </Box>
    </AutPageBox>
  );
};

export default NetworkSelect;
