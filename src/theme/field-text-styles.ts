import { Breakpoint, ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

export default (theme: Theme) =>
  ({
    styleOverrides: {
      root: {
        input: {
          color: theme.palette.offWhite.dark,
        },
      },
    } as ComponentsOverrides<Theme>['MuiTextField'],
    // variants: [
    //   {
    //     props: {
    //       variant: "standard"
    //     },
    //     style: {}
    //   }
    // ]
  } as {
    defaultProps?: ComponentsProps['MuiTextField'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTextField'];
    variants?: ComponentsVariants['MuiTextField'];
  });
