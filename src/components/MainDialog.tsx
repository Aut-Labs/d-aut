import { Box, Dialog, Theme, styled, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
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
          <Switch>
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={(props: RouteComponentProps<any>) => <route.component {...props} {...route.props} />}
                />
              );
            })}
          </Switch>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MainDialog;
