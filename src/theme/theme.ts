import { createTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';
import AutButtonStyles from './button-styles';
import AutTextFieldStyles from './field-text-styles';
import AutTextStyles from './text-styles';
import AutPalette from './palette';
import './theme.overrides';

// import Fractul from '../assets/fonts/Fractul/FractulRegular/font.woff2';
// import Fractul from '../assets/fonts/Fractul/FractulAltBold/font.woff2';
// import Fractul from '../assets/fonts/Fractul/Fractul/font.woff2';

const AutTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        // @font-face {
        //   font-family: 'Fractul';
        //   font-style: normal;
        //   font-display: swap;
        //   font-weight: 400;
        //   src: local('Fractul'), local('Fractul-Regular'), url() format('woff2');
        //   unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        // }
        @font-face {
          font-family: "FractulAltBold";
          src: url("../assets/fonts/Fractul/FractulAltBold/font.woff2") format("woff2"),
            url("../assets/fonts/Fractul/FractulAltBold/font.woff") format("woff");
        }
        
        @font-face {
          font-family: "FractulAltLight";
          src: url("../assets/fonts/Fractul/FractulAltLight/font.woff2") format("woff2"),
            url("../assets/fonts/Fractul/FractulAltLight/font.woff") format("woff");
        }
        
        @font-face {
          font-family: "FractulRegular";
          src: url("../assets/fonts/Fractul/FractulRegular/font.woff2") format("woff2"),
            url("../assets/fonts/Fractul/FractulRegular/font.woff") format("woff");
        }
      `,
    },
    MuiTooltip: {
      defaultProps: {
        TransitionComponent: Fade,
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: AutPalette.primary.main,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: AutPalette.secondary.contrastText,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 990,
      lg: 1220,
      xl: 1366,
      xxl: 1920,
    },
  },
  palette: AutPalette,
  shape: {
    borderRadius: 0,
  },
});

AutTheme.typography = AutTextStyles(AutTheme);
// AutTheme.typography.fontFamily = 'FractulRegular';
AutTheme.components.MuiButton = AutButtonStyles(AutTheme);
AutTheme.components.MuiTextField = AutTextFieldStyles(AutTheme);

export default AutTheme;
