import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { FlowMode, setJustJoining } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { setSelectedNetwork } from '../store/wallet-provider';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { LoadingProgress } from '../components/LoadingProgress';
import { useSelector } from 'react-redux';
import { Connector, useConnect } from 'wagmi';
import WalletConnectorButtons from '../components/WalletConnectorButtons';

const NewUser: React.FunctionComponent = (props) => {
  const flowMode = useSelector(FlowMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { connect } = useWeb3ReactConnectorHook();
  const { isLoading } = useConnect();

  const checkForExistingAutId = async (account: string) => {
    const hasAutId = await dispatch(checkIfAutIdExists(account));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity());
      if (!hasAutId.payload) {
        await dispatch(setJustJoining(false));
        navigate('userdetails');
      } else {
        await dispatch(setJustJoining(true));
        navigate('role');
      }
    }
  };

  useEffect(() => {
    dispatch(setSelectedNetwork(null));
  }, []);

  const tryConnect = async (connector: Connector) => {
    const account = await connect(connector);
    if (account) {
      await checkForExistingAutId(account);
    }
  };

  return (
    <>
      {isLoading ? (
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
