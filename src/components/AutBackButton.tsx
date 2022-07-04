import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';
import { pxToRem } from '../services/web3/utils';
import { ReactComponent as BackIcon } from '../assets/back-icon.svg';

export const StyledButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-root': {
    height: '20px',
    textTransform: 'none',
    color: 'white',
    letterSpacing: '3px',
    fontSize: pxToRem(14),
    '&.Mui-disabled': {
      color: 'white',
      opacity: '.3',
    },
  },
}));

StyledButton.defaultProps = {
  startIcon: <BackIcon />,
};

export const AutBackButton = () => {
  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  };
  return (
    <Box sx={{ height: '40px', display: 'flex', alignItems: 'flex-end', padding: '0 20px', width: 'calc(100% - 40px)' }}>
      <StyledButton onClick={() => handleClick()}>Back</StyledButton>
    </Box>
  );
};

export const ButtonIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '22px',
  height: '22px',
}));
