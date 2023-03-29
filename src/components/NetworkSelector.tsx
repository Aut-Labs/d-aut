import { Box, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { NetworksConfig } from '../store/wallet-provider';
import { AutPageBox } from './AutPageBox';
import { AutHeader } from './AutHeader';
import { FormAction, FormContent, FormWrapper } from './FormHelpers';
import { AutSelectField, FormHelperText } from './Fields';
import { AutButton } from './AutButton';

const NetworkSelector = ({ onSelect, onBack }) => {
  const networkConfigs = useSelector(NetworksConfig);
  const { control, handleSubmit, formState } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    onSelect(data.chainId);
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
          backAction={onBack}
          logoId="networks-logo"
          title="Unsupported network detected."
          subtitle="Pick a supported network to connect."
        />
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <FormContent>
            <Controller
              name="chainId"
              control={control}
              rules={{
                validate: {
                  selected: (v: any) => !!v,
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
                      const networkConfig = networkConfigs.find((c) => c.chainId === selected);
                      return networkConfig.network || selected;
                    }}
                    name={name}
                    color="primary"
                    value={value || ''}
                    displayEmpty
                    required
                    onChange={onChange}
                    helperText={<FormHelperText name={name} errors={formState.errors} />}
                  >
                    {networkConfigs &&
                      networkConfigs.map((config) => (
                        <MenuItem key={`autId-${config.network}`} color="primary" value={config.chainId}>
                          {config.network}
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

export default NetworkSelector;
