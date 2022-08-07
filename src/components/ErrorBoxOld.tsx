import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { AutButton } from './AutButton';

const ErrorBox = ({ errorData }) => {
  const handleOnClick = () => {
    // console.log(errorData);
    if (errorData) {
      errorData.action();
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '460px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ mb: '26px', width: '90%' }} variant="h2">
        {errorData.errorMessage}
      </Typography>

      <AutButton onClick={handleOnClick}>{errorData.actionLabel}</AutButton>
    </Box>
  );
};

export default ErrorBox;
