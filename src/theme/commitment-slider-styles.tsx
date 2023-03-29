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
  Box,
} from '@mui/material';
import { sliderTrackColor } from '../assets/base64assets';

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

const errorTypes = (minCommitment) => {
  return {
    min: `Min ${minCommitment} commitment level!`,
  };
};

interface AutSliderProps {
  communityName: string;
  minCommitment: number;
  value: any;
  sliderProps: SliderProps;
  name: string;
  errors: any;
  sx?: any;
}

const SliderWrapper = styled('div')({
  position: 'relative',
});

export const AutCommitmentSlider = ({ value, name, minCommitment, errors, sx, sliderProps, ...props }: AutSliderProps) => {
  return (
    <SliderWrapper sx={sx}>
      <CommitmentMessage value={value} />
      <div style={{ position: 'relative' }}>
        <Slider
          {...sliderProps}
          sx={{
            '.MuiSlider-track': {
              borderRight: value > 0 ? `1px solid white` : `0px solid white`,
            },
            backgroundImage: `-webkit-linear-gradient(left, #707070, #707070 ${minCommitment * 10 + 0.5}%, transparent ${
              minCommitment * 10 + 0.5
            }%, transparent 100%)`,
          }}
        />
        {/* <Box sx={{ width: '168px', px: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            align="center"
            variant="h5"
            sx={{
              fontWeight: '400',
              maxWidth: '320px',
              color: '#000',
            }}
          >
            1
          </Typography>
          <Typography
            align="center"
            variant="h5"
            sx={{
              transform: 'translate(0px, -22px);',
              mixBlendMode: 'difference',
              fontWeight: '400',
              maxWidth: '320px',
              pointerEvents: 'none',
            }}
          >
            {4}
          </Typography>
          <Typography
            align="center"
            variant="h5"
            sx={{
              fontWeight: '400',
              maxWidth: '320px',
              color: '#000',
            }}
          >
            10
          </Typography>
        </Box> */}
      </div>
      <div
        style={{
          marginTop: '-3px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <FormHelperText errorTypes={errorTypes(minCommitment)} name={name} errors={errors}>
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
    borderColor: '#256BB0',
  },
  '.MuiSlider-track': {
    backgroundImage: `${sliderTrackColor}`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  '.MuiSlider-thumb': {
    background: '#256BB0',
    boxShadow: 'inset 0px 0px 0px 1px #FFF',
  },
  '.MuiTypography-root': {
    color: 'color.main',
  },
});

export default (theme: Theme) =>
  ({
    ...theme.components.MuiSelect,
    styleOverrides: {
      root: {
        '&.MuiSlider-colorPrimary': generateColors(theme.palette.white),
        width: '400px',
        height: '42px',
        borderRadius: '0',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '0',

        'span[data-index="10"].MuiSlider-mark': {
          display: 'none',
        },
        'span[data-index="0"].MuiSlider-mark': {
          display: 'none',
        },
        '.MuiSlider-thumb': {
          width: '25px',
          height: '25px',
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
