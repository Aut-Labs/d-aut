import { Breakpoint, ComponentsOverrides, ComponentsProps, ComponentsVariants, PaletteColor, Theme } from '@mui/material';

const fontSize = {
  xs: '16px',
  sm: '16px',
  md: '16px',
  lg: '16px',
  xxl: '24px',
};

const generateColors = (color: PaletteColor, white: PaletteColor) => ({
  fontWeight: 'normal',
  letterSpacing: '-0.008em',
  fontFamily: 'FractulRegular',
  '&:before': {
    borderColor: color.dark,
  },
  '&:hover:not(.Mui-disabled):before': {
    borderColor: color.dark,
  },
});

export default (theme: Theme) =>
  ({
    styleOverrides: {
      '&.MuiInputBase-root:before': {
        borderColor: theme.palette.error.main,
      },
      standardOffWhite: {
        color: 'white',
        '&.MuiInputBase-root:before': {
          borderColor: theme.palette.error.main,
        },
        '& .MuiInputBase-input': {
          color: theme.palette.offWhite.dark,
        },
      },
      // standardOffWhite: (props) => {
      //   console.log(props, "ownerState");
      //   const styles = generateColors(
      //     theme.palette.offWhite,
      //     theme.palette.white
      //   );
      //   Object.keys(fontSize).forEach((key: Breakpoint) => {
      //     styles[theme.breakpoints.up(key)] = {
      //       fontSize: fontSize[key]
      //     };
      //   });

      //   console.log(styles, "styles");
      //   return styles;
      // }
    } as ComponentsOverrides<Theme>['MuiSelect'],
  } as {
    defaultProps?: ComponentsProps['MuiSelect'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSelect'];
    variants?: ComponentsVariants['MuiSelect'];
  });
