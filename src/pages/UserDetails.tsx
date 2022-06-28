import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SwUploadFile, toBase64 } from 'sw-web-shared';
import { useHistory } from 'react-router-dom';
import { Box, Button, Input, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import AutFileUpload from '../components/AutFileUpload';
import { ReactComponent as Upload } from '../assets/upload.svg';
import BackButton from '../components/BackButton';
import { setUserData, userData } from '../store/user-data.reducer';
import { AutTextField, FormHelperText } from '../components/Fields';
import AutLogo from '../components/AutLogo';
import { AutButton } from '../components/AutButton';
import { AutBackButton } from '../components/AutBackButton';

interface Values {
  picture?: File;
  text: string;
}

const UserDetails: React.FunctionComponent = (props) => {
  const history = useHistory();
  const userInput = useSelector(userData);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: userInput,
  });

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(setUserData(data));
    history.push('/role');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <AutBackButton />
      <Box>
        <AutLogo />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        TELL US ABOUT YOU
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            maxWidth: '382px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Controller
            name="picture"
            control={control}
            rules={{ required: true }}
            render={({ field: { name, value, onChange }, fieldState, formState }) => {
              return (
                <Box
                  sx={{
                    mt: '45px',
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
                width="330"
                variant="standard"
                required
                autoFocus
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder="Nickname"
                helperText={<FormHelperText value={value} name={name} errors={formState.errors} />}
              />
            )}
          />
          <AutButton sx={{ mt: '40px' }} type="submit" disabled={!isValid}>
            Next
          </AutButton>
        </Box>
      </form>
    </Box>
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
