import { Box, Dialog, Theme, styled, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Route, Routes } from 'react-router-dom';
import routes from '../config/routes';
import { dialogBackground } from '../assets/base64assets';

const DialogContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  // background: `${dialogBackground}`,
  // backgroundPosition: 'center',
  // backgroundRepeat: 'no-repeat',
  // backgroundSize: 'cover',
  // backgroundColor: `black`,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '100%',
  },
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
    minWidth: '450px',
    minHeight: '450px',
  },
  [theme.breakpoints.up('xxl')]: {
    maxWith: '650px',
    minWidth: '650px',
    minHeight: '650px',
  },
}));

function MainDialog({ container, open, handleClose }) {
  const theme: Theme = useTheme() as Theme;

  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Dialog
        fullScreen={sm}
        container={container}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: 'wallet-connector-modal',
        }}
        sx={{
          '&.MuiModal-root .wallet-connector-modal': {
            borderColor: 'divider',
            backgroundColor: '#1E2430',
            borderRadius: {
              sm: '12px',
            },
            boxShadow: '0px 16px 80px 0px #2E90FA, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)',
          },
        }}
      >
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
