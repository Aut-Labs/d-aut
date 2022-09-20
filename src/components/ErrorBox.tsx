import { Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { errorAction, errorState } from '../store/aut.reducer';
import AutLogo from './AutLogo';
import { AutButton } from './AutButton';
import { InternalErrorTypes } from '../utils/error-parser';

export const ErrorBox = () => {
  const errorMessage = useSelector(errorState);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleError = () => {
    if (errorMessage === InternalErrorTypes.AutIDAlreadyExistsForAddress || errorMessage === InternalErrorTypes.UsernameAlreadyTaken) {
      dispatch(errorAction(null));
    } else {
      dispatch(errorAction(null));
      history.push('/');
    }
  };
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mt: '16px' }}>
        <AutLogo id="error-logo" />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#B10000', mt: '25px', textAlign: 'center' }} variant="h1">
          {errorMessage}
        </Typography>
      </Box>
      <AutButton sx={{ my: '30px' }} onClick={handleError}>
        Return
      </AutButton>
    </Box>
  );
};
