import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import AutFileUpload from '../components/AutFileUpload';
import { setUserData, userData } from '../store/user-data.reducer';
import { AutTextField, FormHelperText } from '../components/Fields';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutPageBox } from '../components/AutPageBox';
import { useAppDispatch } from '../store/store.model';
import { checkIfNameTaken } from '../services/web3/api';
import { InternalErrorTypes } from '../utils/error-parser';
import { toBase64 } from '../utils/utils';
import { FormWrapper, FormContent, FormAction } from '../components/FormHelpers';
import { AutHeader } from '../components/AutHeader';
import { useWeb3React } from '@web3-react/core';

interface Values {
  picture?: File;
  text: string;
}

const UserDetails: React.FunctionComponent = (props) => {
  const history = useHistory();
  const userInput = useSelector(userData);
  const dispatch = useAppDispatch();
  const { connector } = useWeb3React();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: userInput,
  });

  const onSubmit = async (data) => {
    // console.log(data);
    const result = await dispatch(checkIfNameTaken({ username: data.username }));
    if (result.payload !== InternalErrorTypes.UsernameAlreadyTaken) {
      await dispatch(setUserData(data));
      history.push('/role');
    }
  };

  const deactivateConnector = async () => {
    if (connector) {
      await connector.deactivate();
    }
  };

  return (
    <AutPageBox>
      <AutHeader logoId="user-details-logo" title="TELL US ABOUT YOU" backAction={deactivateConnector} />
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormContent>
          <Controller
            name="picture"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, value, onChange }, fieldState, formState }) => {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '75px',
                  }}
                >
                  <AutFileUpload
                    initialPreviewUrl={value}
                    fileChange={async (file) => {
                      if (file) {
                        onChange(await toBase64(file));
                      } else {
                        onChange(null);
                      }
                    }}
                  />
                </Box>
              );
            }}
          />
          <Controller
            name="username"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, value, onChange }, formState }) => (
              // <TextField onChange={onChange} value={value} label="username" />
              <AutTextField
                width="360"
                variant="standard"
                required
                autoFocus
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder="Nickname"
                helperText={<FormHelperText value={value} name={name} errors={formState.errors as any} />}
              />
            )}
          />
        </FormContent>
        <FormAction>
          <AutButton type="submit" disabled={!isValid}>
            Next
          </AutButton>
        </FormAction>
      </FormWrapper>
    </AutPageBox>
    // <Box
    //   sx={{
    //     width: '100%',
    //     minHeight: '460px',
    //     display: 'flex',
    //     justifyContent: 'space-around',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //   }}
    // >
    //   <>
    //     <Box
    //       sx={{
    //         width: '100%',
    //         display: 'flex',
    //         justifyContent: 'space-between',
    //         alignContent: 'center',
    //       }}
    //     >
    //       <BackButton handleClick={handleBackClick} />
    //     </Box>
    //     <Box
    //       sx={{
    //         width: '100%',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //       }}
    //     >

    //     </Box>
    //   </>
    // </Box>
  );
};

export default UserDetails;
