import { Breakpoint, ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

export const buttonStyles = {
  normal: {
    // width: {
    //   xs: '300px',
    //   sm: '350px',
    //   md: '350px',
    //   xxl: '350px',
    // },
    // height: '75px',
    fontFamily: 'FractulAltLight',
    letterSpacing: '0.01em',
    fontSize: {
      xs: '17px',
      sm: '17px',
      md: '17px',
      xxl: '17px',
    },
    paddingTop: {
      xs: '10px',
      sm: '12px',
      md: '12px',
      xxl: '15px',
    },
    paddingBottom: {
      xs: '10px',
      sm: '12px',
      md: '12px',
      xxl: '15px',
    },
    paddingLeft: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '48px',
    },
    paddingRight: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '48px',
    },
  },
  half: {
    width: {
      xs: '160px',
      sm: '210px',
      md: '210px',
      xxl: '210px',
    },
    height: '75px',
    fontFamily: 'FractulAltLight',
    letterSpacing: '0.01em',
    fontSize: {
      xs: '17px',
      sm: '17px',
      md: '17px',
      xxl: '17px',
    },
    paddingTop: {
      xs: '10px',
      sm: '12px',
      md: '12px',
      xxl: '15px',
    },
    paddingBottom: {
      xs: '10px',
      sm: '12px',
      md: '12px',
      xxl: '15px',
    },
    paddingLeft: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '48px',
    },
    paddingRight: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '48px',
    },
  },
  chunky: {
    width: {
      xs: '300px',
      sm: '350px',
      md: '350px',
      xxl: '350px',
    },
    fontFamily: 'FractulAltLight',
    letterSpacing: '0.01em',
    fontSize: {
      xs: '16px',
      sm: '16px',
      md: '20px',
      xxl: '24px',
    },
    paddingTop: {
      xs: '16px',
      sm: '24px',
      md: '24px',
      xxl: '40px',
    },
    paddingBottom: {
      xs: '16px',
      sm: '24px',
      md: '24px',
      xxl: '40px',
    },
    paddingLeft: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '90px',
    },
    paddingRight: {
      xs: '32px',
      sm: '40px',
      md: '48px',
      xxl: '90px',
    },
  },
  square: {
    width: {
      xs: '300px',
      sm: '350px',
      md: '350px',
      xxl: '350px',
    },
    fontFamily: 'FractulAltLight',
    letterSpacing: '0.01em',
    borderRadius: 0,
    fontSize: {
      xs: '16px',
      sm: '16px',
      md: '16px',
      xxl: '20px',
    },
    paddingTop: {
      xs: '12px',
      sm: '14px',
      md: '14px',
      xxl: '22px',
    },
    paddingBottom: {
      xs: '12px',
      sm: '14px',
      md: '14px',
      xxl: '22px',
    },
    paddingLeft: {
      xs: '18px',
      sm: '22px',
      md: '24px',
      xxl: '30px',
    },
    paddingRight: {
      xs: '18px',
      sm: '22px',
      md: '24px',
      xxl: '30px',
    },
  },
  web: {
    width: {
      xs: '300px',
      sm: '300px',
      md: '350px',
      xxl: '350px',
    },
    fontFamily: 'FractulAltLight',
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    borderRadius: 0,
    fontSize: {
      xs: '20px',
      sm: '20px',
      md: '20px',
      xxl: '20px',
    },
    paddingTop: {
      xs: '0px',
      sm: '0px',
      md: '0px',
      xxl: '0px',
    },
    paddingBottom: {
      xs: '0px',
      sm: '0px',
      md: '0px',
      xxl: '0px',
    },
    paddingLeft: {
      xs: '0px',
      sm: '0px',
      md: '0px',
      xxl: '0px',
    },
    paddingRight: {
      xs: '0px',
      sm: '0px',
      md: '0px',
      xxl: '0px',
    },
  },
};

export default (theme: Theme) =>
  ({
    ...theme.components.MuiButton,
    styleOverrides: {
      outlinedOffWhite: {
        borderColor: theme.palette.offWhite.main,
        '&:hover': {
          backgroundColor: theme.palette.offWhite.main,
          color: theme.palette.nightBlack.main,
        },
        '&.Mui-disabled': {
          borderColor: theme.palette.offWhite.main,
          color: theme.palette.offWhite.main,
          opacity: '0.5',
        },
      },
    },
    variants: [
      {
        props: {
          variant: 'outlined',
        },
        style: {
          '&.MuiButton-root': {
            borderWidth: '3px',
            borderStyle: 'solid',
            borderRadius: '50px',
          },
        },
      },
      {
        props: {
          variant: 'square',
        },
        style: {
          '&.MuiButton-root': {
            borderWidth: '3px',
            borderStyle: 'solid',
          },
        },
      },
      {
        props: {
          variant: 'web',
        },
        style: {
          '&.MuiButton-root': {
            borderColor: theme.palette.offWhite.main,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderRadius: '50px',
          },
        },
      },
      ...Object.keys(buttonStyles).reduce(
        (prev, curr) => {
          const { width, fontSize, paddingBottom, paddingLeft, paddingRight, paddingTop, ...restStyles } = buttonStyles[curr];
          const currStyle = restStyles;
          Object.keys(fontSize).forEach((key: Breakpoint) => {
            currStyle[theme.breakpoints.up(key)] = {
              fontSize: fontSize[key],
            };
          });
          Object.keys(paddingBottom).forEach((key: Breakpoint) => {
            currStyle[theme.breakpoints.up(key)] = {
              ...currStyle[theme.breakpoints.up(key)],
              paddingBottom: paddingBottom[key],
            };
          });
          Object.keys(paddingLeft).forEach((key: Breakpoint) => {
            currStyle[theme.breakpoints.up(key)] = {
              ...currStyle[theme.breakpoints.up(key)],
              paddingLeft: paddingLeft[key],
            };
          });
          Object.keys(paddingRight).forEach((key: Breakpoint) => {
            currStyle[theme.breakpoints.up(key)] = {
              ...currStyle[theme.breakpoints.up(key)],
              paddingRight: paddingRight[key],
            };
          });

          Object.keys(paddingTop).forEach((key: Breakpoint) => {
            currStyle[theme.breakpoints.up(key)] = {
              ...currStyle[theme.breakpoints.up(key)],
              paddingTop: paddingTop[key],
            };
          });

          // Object.keys(width).forEach((key: Breakpoint) => {
          //   currStyle[theme.breakpoints.up(key)] = {
          //     ...currStyle[theme.breakpoints.up(key)],
          //     width: width[key],
          //   };
          // });

          prev = [
            ...prev,
            {
              props: {
                size: curr as any,
              },
              style: currStyle,
            },
          ];
          return prev;
        },
        [] as ComponentsVariants['MuiButton']
      ),
    ],
  }) as {
    defaultProps?: ComponentsProps['MuiButton'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiButton'];
    variants?: ComponentsVariants['MuiButton'];
  };
