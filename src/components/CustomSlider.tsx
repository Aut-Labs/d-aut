import { Box, Slider, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';

export const CustomSlider = ({ name, control, setValue, rules, onValueChange, defaultValue }) => {
  // console.log(defaultValue);
  const [sliderValue, setSliderValue] = React.useState(defaultValue);

  useEffect(() => {
    if (sliderValue) setValue(name, sliderValue, { shouldValidate: true });
  }, [name, setValue, sliderValue]);

  const handleChange = (event: any, newValue: number | number[]) => {
    onValueChange(newValue);
    setSliderValue(newValue as number);
  };

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState, formState }) => (
        <>
          <Slider
            sx={{ maxWidth: '166px', border: 2, borderRadius: 0, borderColor: '#000000', p: '10px' }}
            defaultValue={defaultValue}
            step={1}
            min={1}
            max={10}
            value={sliderValue}
            onChange={handleChange}
          />

          <Box sx={{ width: '168px', px: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              align="center"
              variant="h5"
              sx={{
                fontWeight: '400',
                maxWidth: '320px',
                color: '#000',
              }}
            >
              1
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
              sx={{
                transform: 'translate(0px, -22px);',
                mixBlendMode: 'difference',
                fontWeight: '400',
                maxWidth: '320px',
                pointerEvents: 'none',
              }}
            >
              {sliderValue}
            </Typography>
            <Typography
              align="center"
              variant="h5"
              sx={{
                fontWeight: '400',
                maxWidth: '320px',
                color: '#000',
              }}
            >
              10
            </Typography>
          </Box>
        </>
      )}
    />
  );
};
