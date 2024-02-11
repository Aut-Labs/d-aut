import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { FlowMode, ResultState, loadingStatus, setJustJoining, updateAutState } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { LoadingProgress } from '../components/LoadingProgress';
import { useSelector } from 'react-redux';
import WalletConnectorButtons from '../components/WalletConnectorButtons';
import { useState } from 'react';
import { useAutConnectorContext } from '..';
import { Connector } from '../types/d-aut-config';

const NewUser: React.FunctionComponent = () => {
  const flowMode = useSelector(FlowMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useSelector(loadingStatus);
  const [shouldCheckForAutID, setCheckAutID] = useState(false);
  const { connect } = useAutConnectorContext();

  const checkForExistingAutId = async (account: string) => {
    const hasAutId = await dispatch(checkIfAutIdExists(account));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity());
      if (!hasAutId.payload) {
        await dispatch(setJustJoining(false));
        navigate('/userdetails');
      } else {
        await dispatch(setJustJoining(true));
        navigate('/role');
      }
    }
  };

  const tryConnect = async (c: Connector) => {
    setCheckAutID(true);
    const state = await connect(c);
    if (state.error) {
      dispatch(
        updateAutState({
          errorStateAction: state.error as string,
          status: ResultState.Failed,
          user: null,
        })
      );
      setCheckAutID(false);
      return;
    }
    checkForExistingAutId(state.address);
    setCheckAutID(false);
  };

  return (
    <>
      {status === ResultState.Loading || shouldCheckForAutID ? (
        <>
          <LoadingProgress />
        </>
      ) : (
        <>
          <AutPageBox>
            <AutHeader
              hideBackBtn={!!flowMode}
              logoId="new-user-logo"
              title="Welcome"
              subtitle={
                <>
                  First, import your wallet <br /> & claim your Role in your DAO
                  {/* <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span> */}
                </>
              }
            />
            <WalletConnectorButtons onConnect={tryConnect} />
          </AutPageBox>
        </>
      )}
    </>
  );
};

export default NewUser;
