import { Box, Dialog, Theme, styled, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Route, Routes } from 'react-router-dom';
import routes from '../config/routes';
import { dialogBackground } from '../assets/base64assets';

const DialogContent = styled(Box)(({ theme }) => ({
  width: '570px',
  height: '550px',
  display: 'flex',
  background: `${dialogBackground}`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundColor: `black`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
  },
}));

function MainDialog({ container, open, handleClose }) {
  const theme: Theme = useTheme() as Theme;

  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Dialog fullScreen={sm} container={container} open={open} onClose={handleClose}>
        <DialogContent>
          <Routes>
            {routes.map((route, index) => {
              return <Route key={index} path={route.path} element={<route.component {...route.props} />} />;
            })}
          </Routes>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MainDialog;
