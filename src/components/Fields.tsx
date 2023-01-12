import { Theme } from '@emotion/react';
import { Select, SelectProps, TextField, TextFieldProps, Typography } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';
import { pxToRem } from '../utils/utils';

interface FormHelperTextProps {
  errors: any;
  name: string;
  children?: string | JSX.Element;
  errorTypes?: any;
  positionAbsolute?: boolean;
}

const defaultErrorTypes = {
  required: 'Field is required!',
  pattern: 'Username cannot contain spaces!',
};

export function FormHelperText({ errors, name, errorTypes, children = null, positionAbsolute = true }: FormHelperTextProps) {
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
        align={`${positionAbsolute ? 'right' : 'center'}`}
        component="span"
        variant="body2"
        className="auto-helper-error"
        sx={{
          fontFamily: 'FractulRegular',
          width: '100%',
          position: `${positionAbsolute ? 'absolute' : 'static'}`,
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
      '&:after': {
        borderWidth: '1px',
        transform: 'scaleX(1)',
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
        fontFamily: 'FractulRegular',
        paddingTop: 0,
        paddingBottom: 0,
      },
      '&::placeholder': {
        opacity: 1,
        color: 'red',
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

const StyledSelectField = styled((props: SelectProps) => {
  return (
    <Select
      MenuProps={{
        sx: {
          '.MuiBackdrop-root': {
            backdropFilter: 'none',
          },
          '.MuiPaper-root': {
            borderWidth: '1px !important',
            background: 'black',
          },
          borderTop: 0,
          '& ul': {
            color: '#000',
            padding: 0,
          },
          '& li': {
            fontSize: pxToRem(18),
            color: 'white',
            '&:hover:not(.Mui-selected)': {
              backgroundColor: '#009FE3',
              color: '#fff',
            },
            '&.Mui-selected:hover, &.Mui-selected': {
              backgroundColor: '#009FE3',
              color: '#fff',
            },
          },
        },
        disablePortal: true,
      }}
      {...props}
    />
  );
})(() => ({
  '.MuiFormHelperText-root': {
    marginRight: 0,
    marginLeft: 0,
    textAlign: 'right',
    position: 'relative',
  },
  '&.MuiInput-underline': {
    '&:after': {
      borderWidth: '1px',
      transform: 'scaleX(1)',
    },
  },
  '&.MuiOutlinedInput-root, &.MuiInput-underline': {
    width: pxToRem(320),
    '.MuiSelect-select, .MuiSelect-nativeInput': {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    color: '#fff',
    padding: 0,
    fontSize: pxToRem(18),
    height: pxToRem(50),
    '.MuiInputBase-input': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '.MuiSvgIcon-root': {
      fontSize: '20px',
      color: '#fff',
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
  '&.MuiOutlinedInput-root': {
    fieldset: {
      border: '1px solid #439EDD',
    },
    '&:hover fieldset': {
      border: '2px solid #439EDD',
    },
    '.MuiSelect-select, .MuiSelect-nativeInput': {
      justifyContent: 'center',
    },
  },
}));

const SelectWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: pxToRem(45),
  position: 'relative',
  '.auto-helper-info, .auto-helper-error': {
    bottom: '-18px',
  },
});

interface AutSelectProps extends Partial<SelectProps> {
  helperText: JSX.Element;
}
export const AutSelectField = ({ helperText, ...props }: AutSelectProps) => {
  return (
    <SelectWrapper>
      <StyledSelectField {...props} />
      {helperText}
    </SelectWrapper>
  );
};
