import { Breakpoint, Theme } from '@mui/material';
import { Typography, TypographyOptions } from '@mui/material/styles/createTypography';

export const textStyles = {
  h1: {
    fontSize: {
      xs: '68px',
      sm: '68px',
      md: '68px',
      lg: '72px',
      xxl: '96px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.015em',
  },
  h2: {
    fontSize: {
      xs: '42px',
      sm: '42px',
      md: '42px',
      lg: '45px',
      xxl: '60px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.005em',
  },
  h3: {
    fontSize: {
      xs: '32px',
      sm: '35px',
      md: '35px',
      lg: '35px',
      xxl: '48px',
    },
    fontWeight: 'bold',
    letterSpacing: '-0.015em',
  },
  subtitle1: {
    fontSize: {
      xs: '23px',
      sm: '23px',
      md: '23px',
      lg: '25px',
      xxl: '34px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.0025em',
  },
  subtitle2: {
    fontSize: {
      xs: '16px',
      sm: '16px',
      md: '16px',
      lg: '18px',
      xxl: '24px',
    },
    fontWeight: 'bold',
    letterSpacing: '0.0025em',
  },
  body: {
    fontSize: {
      xs: '16px',
      sm: '16px',
      md: '16px',
      lg: '16px',
      xxl: '24px',
    },
    fontWeight: 'normal',
    letterSpacing: '-0.008em',
  },
  caption: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      md: '12px',
      lg: '12px',
      xxl: '16px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.004em',
  },
  overline: {
    fontSize: {
      xs: '12px',
      sm: '12px',
      md: '12px',
      lg: '12px',
      xxl: '16px',
    },
    fontWeight: 'normal',
    letterSpacing: '0.015em',
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
      };
      Object.keys(fontSize).forEach((key: Breakpoint) => {
        prev[curr][theme.breakpoints.up(key)] = {
          fontSize: fontSize[key],
        };
      });
      return prev;
    },
    {
      fontSize: 16,
      fontFamily: ['FractulRegularRegular', ' sans-serif'].join(','),
    } as TypographyOptions
  ) as unknown as Typography;
