import { Box, Dialog, styled, useMediaQuery, useTheme } from '@mui/material';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import routes from '../config/routes';

const DialogContent = styled(Box)(({ theme }) => ({
  width: '550px',
  height: '550px',
  display: 'flex',
  backgroundColor: '#000',
  borderStyle: 'solid',
  borderWidth: '15px',
  borderImage:
    'linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1',
  [theme.breakpoints.down('xl')]: {
    borderWidth: '12px',
    width: '500px',
    height: '500px',
  },
  [theme.breakpoints.down('md')]: {
    borderWidth: '10px',
    width: '480px',
    height: '480px',
  },
  [theme.breakpoints.down('sm')]: {
    borderWidth: '5px',
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
