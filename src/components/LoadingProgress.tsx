import { Box } from '@mui/material';
import animationData from '../assets/aut-load.json';
import { AutHeader } from './AutHeader';
import Lottie from 'react-lottie-player/dist/LottiePlayerLight';

export const LoadingProgress = () => {
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
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <AutHeader hideCloseBtn hideBackBtn title="LOADING ..." />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Lottie play loop animationData={animationData} style={{ height: '150px', width: '150px' }} />
      </Box>
    </Box>
  );
};
