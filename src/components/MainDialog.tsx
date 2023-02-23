import { Box, Dialog, styled, useMediaQuery, useTheme } from '@mui/material';
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
  [theme.breakpoints.down('xs')]: {
    width: '520px',
    height: '500px',
  },
}));

function MainDialog({ container, open, handleClose }) {
  const theme = useTheme();
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
