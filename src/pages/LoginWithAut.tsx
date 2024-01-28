import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { AutHeader } from '../components/AutHeader';
import { LoadingProgress } from '../components/LoadingProgress';
import { FlowMode, ResultState, loadingStatus } from '../store/aut.reducer';
import { useSelector } from 'react-redux';
import { Connector, useAccount, useConnect } from 'wagmi';
import WalletConnectorButtons from '../components/WalletConnectorButtons';
import { IsAuthorised, NetworksConfig } from '../store/wallet-provider';
import { useEffect, useState } from 'react';

const LoginWithAut: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const flowMode = useSelector(FlowMode);
  const networks = useSelector(NetworksConfig);
  const isAuthorised = useSelector(IsAuthorised);
  const { isLoading, connectAsync } = useConnect();
  const { address, isConnected, connector } = useAccount();
  const status = useSelector(loadingStatus);
  const [shouldLoadAutID, setLoadAutID] = useState(false);

  const tryConnect = async (c: Connector) => {
    const connectorChange = c?.id !== connector?.id;
    if (isConnected && address && !connectorChange) {
      dispatch(getAutId(address));
      return;
    }
    setLoadAutID(true);
    const [network] = networks.filter((d) => !d.disabled);
    await connectAsync({ connector: c, chainId: Number(network.chainId) });
  };

  useEffect(() => {
    if (isAuthorised && address && shouldLoadAutID) {
      const load = async () => {
        await dispatch(getAutId(address));
        setLoadAutID(false);
      };
      load();
    }
  }, [isAuthorised, shouldLoadAutID, address]);

  return (
    <>
      {isLoading || status === ResultState.Loading || shouldLoadAutID ? (
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
