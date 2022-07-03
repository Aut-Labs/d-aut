import { Box, Dialog, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import routes from '../config/routes';
import { AutContainerBox } from './AutContainerBox';
import { autState, loadingStatus, ResultState } from '../store/aut.reducer';
import { LoadingProgress } from './LoadingProgress';
import { ErrorBox } from './ErrorBox';

function MainDialog({ container, open, handleClose }) {
  return (
    <>
      <Dialog container={container} open={open} onClose={handleClose}>
        <Box
          sx={{
            width: '520px',
            height: '520px',
            display: 'flex',
            backgroundColor: '#000',
            border: 15,
            borderImage:
              'linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 1',
          }}
        >
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
        </Box>
      </Dialog>
    </>
  );
}

export default MainDialog;
