import { Typography, Slider, SliderProps, styled } from '@mui/material';
import { FieldErrors } from 'react-hook-form';
import { pxToRem } from '../utils/utils';
import { FormHelperText } from './Fields';

export const CommitmentMessages = (value: number) => {
  switch (+value) {
    case 1:
    case 2:
      return 'Just lurking 👀';
    case 3:
    case 4:
      return 'gm gm 😪';
    case 5:
    case 6:
      return 'buidler ⚙️';
    case 7:
    case 8:
      return 'Trusted seed 🌱';
    case 9:
    case 10:
      return 'Soulbound ⛓️';
    default:
      return 'Minimum Commitment Level shown in grey.';
  }
};

/* eslint-disable max-len */
export function CommitmentMessage({ value, children = null }) {
  const message = CommitmentMessages(value);
  return (
    <Typography
      color="white"
      whiteSpace="nowrap"
      align="left"
      component="span"
      variant="subtitle2"
      sx={{ display: 'flex', mb: '4px', height: '13px' }}
    >
      {message}
    </Typography>
  );
}

const StyledSlider = styled(Slider)<CustomSliderProps>(({ minCommitment, theme }) => ({
  width: pxToRem(400),
  height: pxToRem(40),
  color: '#439EDD',
  borderRadius: '0',
  borderWidth: '2px',
  borderStyle: 'solid',
  padding: '0',
  backgroundImage: `-webkit-linear-gradient(left, #6A6A6A, #6A6A6A ${minCommitment * 10}%, transparent ${
    minCommitment * 10
  }%, transparent 100%)`,

  'span[data-index="10"].MuiSlider-mark': {
    display: 'none',
  },
  'span[data-index="0"].MuiSlider-mark': {
    display: 'none',
  },

  '.MuiSlider-mark': {
    background: 'transparent',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#009FE3',

    '&.MuiSlider-markActive': {
      border: 'none',
    },
  },
  '.MuiSlider-track': {
    borderRight: '0',
    background:
      'transparent linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%',
  },

  '.MuiSlider-rail': {
    opacity: '0',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: pxToRem(20),
  },
}));

interface AutSliderProps {
  sliderProps: SliderProps;
  value: any;
  name: string;
  errors: FieldErrors<any>;
  minCommitment: number;
  communityName: string;
}

interface CustomSliderProps {
  minCommitment: number;
}

// const errorTypes = {
//   min: 'Min 1 commitment level!',
// };

const errorTypes = (minCommitment, communityName) => {
  return {
    min: `Whoops - The min level to join ${communityName} is ${minCommitment}`,
  };
};

export const AutSlider = (props: AutSliderProps) => {
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
      }}
    >
      <CommitmentMessage value={props.value} />
      <div style={{ position: 'relative' }}>
        <StyledSlider {...props.sliderProps} minCommitment={props.minCommitment} />
      </div>
      <div style={{ marginTop: '-3px', display: 'flex', justifyContent: 'flex-end' }}>
        <FormHelperText errorTypes={errorTypes(props.minCommitment, props.communityName)} name={props.name} errors={props.errors}>
          <Typography color="white" variant="h5">
            You can change your commitment at any time
          </Typography>
        </FormHelperText>
      </div>
    </div>
  );
};
