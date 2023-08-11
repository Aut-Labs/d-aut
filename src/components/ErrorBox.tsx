import { Box, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { errorAction, errorState, FlowMode } from '../store/aut.reducer';
import AutLogo from './AutLogo';
import { AutButton } from './AutButton';
import { InternalErrorTypes } from '../utils/error-parser';
import { env } from '../services/web3/env';

export const ErrorBox = () => {
  const errorMessage = useSelector(errorState);
  const flowMode = useSelector(FlowMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleError = () => {
    if (errorMessage === InternalErrorTypes.AutIDAlreadyExistsForAddress || errorMessage === InternalErrorTypes.UsernameAlreadyTaken) {
      dispatch(errorAction(null));
    } else {
      dispatch(errorAction(null));
      if (flowMode === 'dashboard') {
        navigate('/autid');
      } else if (flowMode === 'tryAut') {
        navigate('/newuser');
      } else {
        navigate('/');
      }
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
        <Typography sx={{ color: '#B10000', mt: '25px', textAlign: 'center' }} variant="subtitle1">
          {errorMessage}
        </Typography>
        {errorMessage === InternalErrorTypes.AutIDNotFound && (
          <>
            <Typography sx={{ mt: '25px', textAlign: 'center' }} variant="subtitle1">
              Go to the{' '}
              <Link sx={{ color: 'white' }} target="_blank" href={env.REACT_APP_NOVA_SHOWCASE_ADDRESS}>
                Nova showcase
              </Link>{' '}
              to browse DAOs.
            </Typography>
          </>
        )}
      </Box>
      <AutButton variant="outlined" size="normal" sx={{ my: '30px' }} onClick={handleError}>
        RETURN
      </AutButton>
    </Box>
  );
};
