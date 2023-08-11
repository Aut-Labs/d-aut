import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { AutHeader } from '../components/AutHeader';
import { LoadingProgress } from '../components/LoadingProgress';
import { FlowMode, ResultState, loadingStatus } from '../store/aut.reducer';
import { useSelector } from 'react-redux';
import { Connector, useAccount, useConnect } from 'wagmi';
import WalletConnectorButtons from '../components/WalletConnectorButtons';
import { NetworksConfig } from '../store/wallet-provider';

const LoginWithAut: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const flowMode = useSelector(FlowMode);
  const networks = useSelector(NetworksConfig);
  const { isLoading, connectAsync, error } = useConnect();
  const { address, isConnected, connector } = useAccount();
  const status = useSelector(loadingStatus);

  const tryConnect = async (c: Connector) => {
    const connectorChange = c?.id !== connector?.id;
    if (isConnected && address && !connectorChange) {
      dispatch(getAutId(address));
      return;
    }
    const [network] = networks.filter((d) => !d.disabled);
    await connectAsync({ connector: c, chainId: Number(network.chainId) });
    await dispatch(getAutId(address));
  };

  return (
    <>
      {isLoading || status === ResultState.Loading ? (
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
