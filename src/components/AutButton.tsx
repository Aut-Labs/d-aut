import { Button, ButtonProps, styled } from '@mui/material';
import { Box } from '@mui/system';
import { pxToRem } from '../services/web3/utils';

export const AutButton = styled<ButtonProps<any, any>>(Button)(() => ({
  '&.MuiButton-root': {
    borderColor: (theme) => theme.palette.offWhite.main,
    '&.Mui-disabled': {
      color: (theme) => theme.palette.offWhite.main,
      opacity: '.3',
    },
    '&:hover': {
      backgroundColor: (theme) => theme.palette.offWhite.main,
      color: (theme) => theme.palette.offWhite.main,
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
