import { Breakpoint, Theme } from '@mui/material';
import { Typography, TypographyOptions } from '@mui/material/styles/createTypography';

export const textStyles = {
  h1: {
    fontSize: {
      xs: '72px',
      sm: '72px',
      md: '72px',
      lg: '72px',
      xxl: '72px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.015em',
    fontFamily: 'FractulAltBold',
  },
  h2: {
    fontSize: {
      xs: '45px',
      sm: '45px',
      md: '45px',
      lg: '45px',
      xxl: '45px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.005em',
    fontFamily: 'FractulAltBold',
  },
  h3: {
    fontSize: {
      xs: '35px',
      sm: '35px',
      md: '35px',
      lg: '35px',
      xxl: '35px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.015em',
    fontFamily: 'FractulAltBold',
  },
  subtitle1: {
    fontSize: {
      xs: '25px',
      sm: '25px',
      md: '25px',
      lg: '25px',
      xxl: '25px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.0025em',
    fontFamily: 'FractulRegular',
  },
  subtitle2: {
    fontSize: {
      xs: '18px',
      sm: '18px',
      md: '18px',
      lg: '18px',
      xxl: '18px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.0025em',
    fontFamily: 'FractulRegular',
  },
  body: {
    fontSize: {
      xs: '16px',
      sm: '16px',
      md: '16px',
      lg: '16px',
      xxl: '16px',
    },
    fontWeight: 'normal',
    letterSpacing: '-0.008em',
    fontFamily: 'FractulRegular',
  },
  body1: {
    fontSize: {
      xs: '14px',
      sm: '14px',
      md: '14px',
      lg: '14px',
      xxl: '14px',
    },
    fontWeight: 'normal',
    letterSpacing: '-0.008em',
    fontFamily: 'FractulRegular',
  },
  caption: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      md: '12px',
      lg: '12px',
      xxl: '12px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.004em',
    fontFamily: 'FractulRegular',
  },
  button: {
    fontSize: {
      xs: '20px',
      sm: '20px',
      md: '20px',
      lg: '20px',
      xxl: '20px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.015em',
    fontFamily: 'FractulAltLight',
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      md: '12px',
      lg: '12px',
      xxl: '12px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.015em',
    fontFamily: 'FractulRegular',
    textTransform: 'uppercase',
  },
};

export default (theme: Theme) =>
  Object.keys(textStyles).reduce(
    (prev, curr) => {
      const { fontSize, fontWeight, letterSpacing, fontFamily } = textStyles[curr];
      prev[curr] = {
        fontWeight,
        letterSpacing,
        fontFamily,
        color: theme.palette.white.light,
      };
      Object.keys(fontSize).forEach((key: Breakpoint) => {
        prev[curr][theme.breakpoints.up(key)] = {
          fontSize: fontSize[key],
        };
      });
      return prev;
    },
    {
      ...theme.typography,
      fontSize: 16,
      fontFamily: ['FractulRegular', ' sans-serif'].join(','),
    } as TypographyOptions
  ) as unknown as Typography;
