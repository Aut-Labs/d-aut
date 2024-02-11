import React from 'react';
import { Box, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { autState, NovaAddress, ResultState, setStatus, updateErrorState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { Controller, useForm } from 'react-hook-form';
import { FormAction, FormWrapper, FormContent } from '../components/FormHelpers';
import { AutSelectField, FormHelperText } from '../components/Fields';
import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { NetworksConfig, SelectedNetwork, setSelectedNetwork } from '../store/wallet-provider';
import { InternalErrorTypes } from '../utils/error-parser';
import AutSDK from '@aut-labs/sdk';
import { useAutConnectorContext } from '..';

const NetworkSelect: React.FunctionComponent = () => {
  const networkConfigs = useSelector(NetworksConfig);
  const novaAddress = useSelector(NovaAddress);
  const autData = useSelector(autState);
  const selectedNetwork = useSelector(SelectedNetwork);
  const dispatch = useAppDispatch();
  const { state } = useAutConnectorContext();
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      network: selectedNetwork,
    },
  });

  const checkNetwork = async (selectedNetwork: string) => {
    const network = networkConfigs.find((n) => n.network === selectedNetwork);
    // @ts-ignore
    const foundChainId = Number(connector?.provider?.chainId);
    if (foundChainId === network.chainId) {
      await dispatch(getAutId(state.address));
    } else {
      await dispatch(setSelectedNetwork(network));
      try {
        // @ts-ignore
        const { provider } = conn.provider;
        // await EnableAndChangeNetwork(provider, network);
        const sdk = AutSDK.getInstance();
        const signer = provider.getSigner();
        await sdk.init(signer, {
          novaAddress: novaAddress as string,
        });

        const result = await sdk.nova.contract.getAutIDContractAddress();
        console.log(result);

        await sdk.init(signer, {
          novaAddress,
          autIDAddress: result.data,
        });

        await dispatch(getAutId(state.address));
      } catch (e) {
        await dispatch(setSelectedNetwork(null));
        await dispatch(setStatus(ResultState.Failed));
        dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      }
    }
  };

  const onSubmit = async (data: any) => {
    await dispatch(setStatus(ResultState.Loading));
    await checkNetwork(data.network);
  };

  const onBackClicked = async () => {
    await dispatch(setSelectedNetwork(null));
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
                    // @TODO: fix this
                    // renderValue={(selected) => {
                    //   if (!selected) {
                    //     return 'Select Network';
                    //   }
                    //   const autId = autData.autIdsOnDifferentNetworks.find((a) => a.network === selected);
                    //   return autId?.network || selected;
                    // }}
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText name={name} errors={formState.errors} />}
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
              CONNECT
            </AutButton>
          </FormAction>
        </FormWrapper>
      </Box>
    </AutPageBox>
  );
};

export default NetworkSelect;
