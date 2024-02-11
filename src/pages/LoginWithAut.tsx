import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { AutHeader } from '../components/AutHeader';
import { LoadingProgress } from '../components/LoadingProgress';
import { FlowMode, ResultState, loadingStatus, updateAutState } from '../store/aut.reducer';
import { useSelector } from 'react-redux';
import WalletConnectorButtons from '../components/WalletConnectorButtons';
import { useState } from 'react';
import { useAutConnectorContext } from '..';
import { Connector } from '../types/d-aut-config';

const LoginWithAut: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const flowMode = useSelector(FlowMode);
  const status = useSelector(loadingStatus);
  const [shouldLoadAutID, setLoadAutID] = useState(false);
  const { connect } = useAutConnectorContext();

  const tryConnect = async (c: Connector) => {
    setLoadAutID(true);
    const state = await connect(c);

    if (state.error) {
      dispatch(
        updateAutState({
          errorStateAction: state.error as string,
          status: ResultState.Failed,
          user: null,
        })
      );
      setLoadAutID(false);
      return;
    }
    await dispatch(getAutId(state.address));
    setLoadAutID(false);
  };

  return (
    <>
      {status === ResultState.Loading || shouldLoadAutID ? (
        <>
          <LoadingProgress />
        </>
      ) : (
        <>
          <AutPageBox>
            <AutHeader hideBackBtn={!!flowMode} logoId="new-user-logo" title="Welcome back" />
            <WalletConnectorButtons onConnect={tryConnect} />
          </AutPageBox>
        </>
      )}
    </>
  );
};

export default LoginWithAut;
