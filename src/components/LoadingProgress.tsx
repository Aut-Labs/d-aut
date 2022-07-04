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
        padding: '45px 0',
      }}
    >
      <AutHeader
        hideBackBtn
        title="LOADING ..."
        subtitle={
          <>
            Funny words here that change <br /> as the loading process happens
          </>
        }
      />
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
