import { Box, Typography } from '@mui/material';
import * as LottiePlayer from '@lottiefiles/lottie-player';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/aut-load.json';
import AutLogo from './AutLogo';

export const LoadingProgress = (props) => {
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
        <AutLogo id="loading-logo" />
      </Box>
      <Typography sx={{ mt: '25px' }} variant="h3">
        LOADING YOUR ...
      </Typography>
      <Typography sx={{ mt: '25px' }} variant="h4">
        Funny words here that change
      </Typography>
      <Typography variant="h4">as the loading process happens</Typography>
      <Player autoplay loop src={animationData} style={{ height: '300px', width: '300px' }} />
    </Box>
  );
};
