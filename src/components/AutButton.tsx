import { Button, ButtonProps, styled } from '@mui/material';
import { Box } from '@mui/system';
import { pxToRem } from '../utils/utils';

export const AutButton = styled<ButtonProps<any, any>>(Button)(() => ({
  '&.MuiButton-root': {
    borderColor: '#FFF',
    '&.Mui-disabled': {
      color: '#FFF',
      opacity: '.3',
    },
    '&:hover': {
      backgroundColor: '#FFF',
      color: '#000',
    },
  },
}));

export const SmallerAutButton = styled<ButtonProps<'button', any>>(Button)(() => ({
  '&.MuiButton-root': {
    height: '55px',
    width: '190px',
    border: `${pxToRem(3)} solid #009FE3`,
    borderRadius: '50px',
    textDecoration: 'uppercase',
    color: 'white',
    textTransform: 'none',
    letterSpacing: '3px',
    fontSize: pxToRem(14),
    '&.Mui-disabled': {
      color: 'white',
      opacity: '.3',
    },
    '&:hover': {
      backgroundColor: '#009ADE',
      color: 'white',
    },
  },
}));

export const ButtonIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
}));
