import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { AutHeader } from '../components/AutHeader';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { LoadingProgress } from '../components/LoadingProgress';
import { FlowMode } from '../store/aut.reducer';
import { useSelector } from 'react-redux';
import { Connector, useConnect } from 'wagmi';
import WalletConnectorButtons from '../components/WalletConnectorButtons';

const LoginWithAut: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const flowMode = useSelector(FlowMode);
  const { connect } = useWeb3ReactConnectorHook();
  const { isLoading } = useConnect();

  const tryConnect = async (connector: Connector) => {
    const account = await connect(connector);
    if (account) {
      await dispatch(getAutId(account));
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
            <AutHeader hideBackBtn={!!flowMode} logoId="new-user-logo" title="Welcome back" />
            <WalletConnectorButtons onConnect={tryConnect} />
          </AutPageBox>
        </>
      )}
    </>
  );
};

export default LoginWithAut;
