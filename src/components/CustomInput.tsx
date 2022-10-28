import { Box, Input, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

export const CustomInput = ({ maxLength, name, control, setValue, rules, defaultValue }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [remainingChars, setRemainingChars] = useState(maxLength);

  useEffect(() => {
    if (inputValue) setValue(name, inputValue, { shouldValidate: true });
  }, [name, setValue, inputValue]);

  const handleChange = (event: any) => {
    setRemainingChars(maxLength - event.target.value.length);
    setInputValue(event.target.value);
  };

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Input
            sx={{
              color: '#000000',
              mt: '14px',
              maxHeight: '40px',
              flex: 1,
              border: 2,
              borderColor: '#000000',
            }}
            value={inputValue}
            onChange={handleChange}
            inputProps={{ maxLength }}
            type="text"
          />

          <Typography
            align="center"
            variant="h6"
            sx={{
              fontSize: 8,
              color: '#707070',
              transform: 'translate(-5px, -15px);',
              mixBlendMode: 'difference',
              fontWeight: '400',
              maxWidth: '320px',
              pointerEvents: 'none',
            }}
          >
            {remainingChars} remaining characters
          </Typography>
        </Box>
      )}
    />
  );
};
