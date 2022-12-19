import { PaletteColor } from '@mui/material';

declare module '@mui/material/styles/createTypography' {
  interface Typography {
    xl?: React.CSSProperties;
    xxl?: React.CSSProperties;
    subtitle1?: React.CSSProperties;
    body?: React.CSSProperties;
    subtitle2?: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }

  interface TypographyOptions {
    xl?: React.CSSProperties;
    xxl?: React.CSSProperties;
    subtitle1?: React.CSSProperties;
    body?: React.CSSProperties;
    subtitle2?: React.CSSProperties;
    emphasis?: React.CSSProperties;
  }
}

declare module '@mui/material/Button' {
  interface ButtonClasses {
    outlinedOffWhite?: true;
  }
  interface ButtonPropsSizeOverrides {
    normal: true;
    chunky: true;
    square: true;
  }

  interface ButtonPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldClasses {
    outlinedOffWhite?: true;
  }
  interface TextFieldPropsSizeOverrides {
    normal: true;
    chunky: true;
    square: true;
  }

  interface TextFieldPropsColorOverrides {
    offWhite?: true;
    nightBlack?: true;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl?: true;
  }

  interface OverridableStringUnion {
    offWhite?: true;
    nightBlack?: true;
  }

  interface Palette {
    offWhite?: PaletteColor;
    nightBlack?: PaletteColor;
  }
}

declare module '@mui/material/Typography/Typography' {
  interface TypographyPropsVariantOverrides {
    // xl?: true;
    // xxl?: true;
    body?: true;
    subtitle1?: true;
    subtitle2?: true;
    emphasis?: true;
  }
}
