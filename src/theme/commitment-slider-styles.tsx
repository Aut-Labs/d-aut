import { FormHelperText } from '../components/Fields';
import { useTheme } from '@emotion/react';
import {
  Typography,
  Slider,
  SliderProps,
  styled,
  PaletteColor,
  Theme,
  ComponentsOverrides,
  ComponentsProps,
  ComponentsVariants,
} from '@mui/material';
import { pxToRem } from '../utils/utils';

const CommitmentMessages = (value: number) => {
  switch (+value) {
    case 1:
    case 2:
      return 'Just lurking 👀';
    case 3:
    case 4:
      return 'gm gm 😪';
    case 5:
    case 6:
      return 'builder ⚙️';
    case 7:
    case 8:
      return 'Trusted seed 🌱';
    case 9:
    case 10:
      return 'Soulbound ⛓️';
    default:
      return 'Minimum Commitment Level for new Members.';
  }
};

export function CommitmentMessage({ value, children = null }) {
  const message = CommitmentMessages(value);
  return (
    <Typography
      color="white"
      whiteSpace="nowrap"
      align="left"
      variant="caption"
      component="span"
      sx={{ display: 'flex', mb: '4px', height: '20px' }}
    >
      {message}
    </Typography>
  );
}

const errorTypes = {
  min: 'Min 1 commitment level!',
};

interface AutSliderProps {
  value: any;
  sliderProps: SliderProps;
  name: string;
  errors: any;
  sx?: any;
}

const SliderWrapper = styled('div')({
  position: 'relative',
});

export const AutCommitmentSlider = ({ value, name, errors, sx, sliderProps, ...props }: AutSliderProps) => {
  return (
    <SliderWrapper sx={sx}>
      <CommitmentMessage value={value} />
      <div style={{ position: 'relative' }}>
        <Slider {...sliderProps} />
      </div>
      <div
        style={{
          marginTop: '-3px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <FormHelperText errorTypes={errorTypes} name={name} errors={errors}>
          <Typography color="white" variant="caption">
            No worries, you’ll be able to change this later.
          </Typography>
        </FormHelperText>
      </div>
    </SliderWrapper>
  );
};

const generateColors = (color: PaletteColor) => ({
  color: color.dark,
  '.MuiSlider-mark': {
    borderColor: color.light,
  },
  '.MuiSlider-track': {
    background: color.light,
  },
  '.MuiSlider-thumb': {
    background: color.main,
    boxShadow: `0px 0px 0px 0px`,
  },
  '.MuiTypography-root': {
    color: color.main,
  },
});

export default (theme: Theme) =>
  ({
    ...theme.components.MuiSelect,
    styleOverrides: {
      root: {
        '&.MuiSlider-colorPrimary': generateColors(theme.palette.offWhite),
        width: pxToRem(600),
        height: pxToRem(65),
        borderRadius: '0',
        borderWidth: '2px',
        borderStyle: 'solid',
        padding: '0',

        'span[data-index="10"].MuiSlider-mark': {
          display: 'none',
        },
        'span[data-index="0"].MuiSlider-mark': {
          display: 'none',
        },
        '.MuiSlider-thumb': {
          width: '45px',
          height: '45px',
        },
        '.MuiSlider-mark': {
          background: 'transparent',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          borderStyle: 'solid',
          borderWidth: '1px',

          '&.MuiSlider-markActive': {
            border: 'none',
          },
        },
        '.MuiSlider-track': {
          borderRight: '0',
        },

        '.MuiSlider-rail': {
          opacity: '0',
        },
      },
    } as ComponentsOverrides<Theme>['MuiSlider'],
  } as {
    defaultProps?: ComponentsProps['MuiSlider'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSlider'];
    variants?: ComponentsVariants['MuiSlider'];
  });
