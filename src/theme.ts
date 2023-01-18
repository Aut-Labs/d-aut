import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// import React from 'react';

// const palette = {
//   type: 'dark',
//   background: {
//     default: '#000000',
//     paper: '#FFFFFF',
//     dark: '#f9f9f9',
//   },
//   text: {
//     secondary: '#D8D8D8',
//     primary: '#FFF',
//     disabled: '#CCCCCC',
//   },
//   primary: {
//     main: '#000000',
//   },
//   secondary: {
//     main: '#FFFFFF',
//   },
//   info: {
//     main: '#FFFFFF',
//     dark: '#7C7C7C',
//   },
// };

// export const AutTheme = responsiveFontSizes(
//   createTheme({
//     components: {
//       MuiBackdrop: {
//         styleOverrides: {
//           root: {
//             backdropFilter: 'blur(20px)',
//           },
//         },
//       },
//     },
//     breakpoints: {
//       values: {
//         xs: 0,
//         sm: 600,
//         md: 960,
//         lg: 1280,
//         xl: 1920,
//       },
//     },
//     palette,
//     shape: {
//       borderRadius: 0,
//     },
//     typography: {
//       fontSize: 16,
//       button: {
//         textTransform: 'none',
//         fontSize: '14px', // 1.25rem
//       },
//       body1: {
//         fontSize: '12px', // 0.875rem
//         letterSpacing: '2px',
//       },
//       body2: {
//         fontSize: '12px', // 0.75rem
//       },
//       subtitle1: {
//         fontSize: '16px', // 1rem
//       },
//       subtitle2: {
//         fontSize: '14px', // 0.875rem
//       },
//       h1: {
//         fontSize: '30px', // 1.875rem
//       },
//       h2: {
//         fontSize: '20px', // 1.25rem
//       },
//       h3: {
//         letterSpacing: '2.5px',
//         fontSize: '18px', // 1.125rem
//       },
//       h4: {
//         letterSpacing: '2.5px',
//         fontSize: '16px', // 0.875rem
//       },
//       h5: {
//         fontSize: '12px', // 0.75rem
//       },
//       h6: {
//         fontSize: '10px', // 0.625rem
//       },
//       xl: {
//         fontSize: '50px',
//       },
//       xxl: {
//         fontSize: '60px',
//       },
//       fontFamily: ['Manrope', ' sans-serif'].join(','),
//     },
//   })
// );

// declare module '@mui/material/styles/createTypography' {
//   interface Typography {
//     xl: React.CSSProperties;
//     xxl: React.CSSProperties;
//   }

//   interface TypographyOptions {
//     xl?: React.CSSProperties;
//     xxl: React.CSSProperties;
//   }
// }

// declare module '@mui/material/Typography/Typography' {
//   interface TypographyPropsVariantOverrides {
//     xl: true;
//     xxl: true;
//   }
// }
