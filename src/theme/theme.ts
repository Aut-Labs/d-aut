import { createTheme } from '@mui/material/styles';
import { Fade } from '@mui/material';
import AutButtonStyles from './button-styles';
import AutTextFieldStyles from './field-text-styles';
import AutTextStyles from './text-styles';
import AutPalette from './palette';
import './theme.overrides';

const AutTheme = createTheme({
  components: {
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
          borderColor: '#FFF',
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

AutTheme.typography = {
  ...AutTheme.typography,
  ...AutTextStyles(AutTheme),
};
AutTheme.components.MuiButton = AutButtonStyles(AutTheme);
AutTheme.components.MuiTextField = AutTextFieldStyles(AutTheme);
// AutTheme.components.MuiSelect = AutSelectFieldStyles(AutTheme);

export default AutTheme;
