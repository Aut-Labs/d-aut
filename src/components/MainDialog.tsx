import { Box, Dialog, styled, useMediaQuery, useTheme } from '@mui/material';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import background from '../assets/static-background.png';
import routes from '../config/routes';

const DialogContent = styled(Box)(({ theme }) => ({
  width: '570px',
  height: '550px',
  display: 'flex',
  background: `url(${background})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  // backgroundColor: `black`,
  [theme.breakpoints.down('xl')]: {
    width: '520px',
    height: '500px',
  },
  [theme.breakpoints.down('md')]: {
    width: '500px',
    height: '480px',
  },
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 10px)',
    height: 'calc(100% - 10px)',
  },
}));

function MainDialog({ container, open, handleClose }) {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Dialog fullScreen={sm} container={container} open={open} onClose={handleClose}>
        <DialogContent>
          {/* {autState.status === ResultState.Failed && <ErrorBox />}
          {autState.status === ResultState.Loading && <LoadingProgress />} */}
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
