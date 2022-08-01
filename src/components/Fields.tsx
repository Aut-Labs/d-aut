import { TextField, TextFieldProps, Typography } from '@mui/material';
import { Controller, FieldErrors } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { pxToRem } from '../services/web3/utils';

interface FormHelperTextProps {
  errors: FieldErrors<any>;
  name: string;
  children?: string | JSX.Element;
  errorTypes?: any;
  value: any;
}

const defaultErrorTypes = {
  required: 'Field is required!',
};

export function FormHelperText({ errors, name, errorTypes, children = null, value }: FormHelperTextProps) {
  if (errors[name]) {
    const { type } = errors[name];
    const types = {
      ...defaultErrorTypes,
      ...(errorTypes || {}),
    };
    // @ts-ignore
    const message = types[type];

    return (
      <Typography
        whiteSpace="nowrap"
        color="red"
        align="right"
        component="span"
        variant="body2"
        className="auto-helper-error"
        sx={{
          width: '100%',
          position: 'absolute',
          left: '0',
        }}
      >
        {message}
      </Typography>
    );
  }
  return (
    children && (
      <Typography
        sx={{
          width: '100%',
          position: 'absolute',
          left: '0',
        }}
        className="auto-helper-info"
        color="white"
        align="right"
        component="span"
        variant="body2"
      >
        {children}
      </Typography>
    )
  );
}

export const AutTextField = styled((props: TextFieldProps & { width: string }) => <TextField {...props} />)(
  ({ theme, width, multiline }) => ({
    width: pxToRem(width),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    '.MuiInputLabel-root': {
      top: '-2px',
    },
    '.MuiFormHelperText-root': {
      marginRight: 0,
      marginLeft: 0,
      textAlign: 'right',
      position: 'relative',
    },
    '.MuiInput-underline': {
      '&:before': {
        borderWidth: '2px',
        borderColor: '#439EDD',
      },
      '&:after': {
        color: '#439EDD',
        borderWidth: '2px',
        borderColor: '#439EDD',
        // transform: 'scaleX(1)',
      },
    },
    '.MuiOutlinedInput-root, .MuiInput-underline': {
      color: '#fff',
      fontSize: pxToRem(18),
      ...(!multiline && {
        padding: 0,
        height: pxToRem(50),
      }),
      '.MuiInputBase-input': {
        paddingTop: 0,
        paddingBottom: 0,
      },
      '&::placeholder': {
        opacity: 1,
        color: '#707070',
      },
      '&::-webkit-input-placeholder': {
        color: '#707070',
        opacity: 1,
        fontSize: pxToRem(18),
      },
      '&::-moz-placeholder': {
        color: '#707070',
        opacity: 1,
      },
    },
    '.MuiOutlinedInput-root': {
      '& > fieldset': {
        border: '1px solid #439EDD',
        borderWidth: '1px',
      },
      '&.Mui-focused fieldset, &:hover fieldset': {
        border: '1px solid #439EDD',
        borderWidth: '1px !important',
      },
    },
  })
);
