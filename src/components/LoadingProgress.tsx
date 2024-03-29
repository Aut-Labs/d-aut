import { Box } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from '../assets/aut-load.json';
import { AutHeader } from './AutHeader';

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
        <Player autoplay loop src={animationData} style={{ height: '300px', width: '300px' }} />
      </Box>
    </Box>
  );
};
