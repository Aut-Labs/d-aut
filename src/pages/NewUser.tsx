import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { FlowMode, ResultState, loadingStatus, setJustJoining } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { NetworksConfig } from '../store/wallet-provider';
import { LoadingProgress } from '../components/LoadingProgress';
import { useSelector } from 'react-redux';
import { Connector, useAccount, useConnect } from 'wagmi';
import WalletConnectorButtons from '../components/WalletConnectorButtons';

const NewUser: React.FunctionComponent = () => {
  const flowMode = useSelector(FlowMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const networks = useSelector(NetworksConfig);
  const { isLoading, connectAsync } = useConnect();
  const status = useSelector(loadingStatus);
  const { address, isConnected, connector } = useAccount();

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
    const connectorChange = c?.id !== connector?.id;
    if (isConnected && address && !connectorChange) {
      checkForExistingAutId(address);
      return;
    }
    const [network] = networks.filter((d) => !d.disabled);
    await connectAsync({ connector: c, chainId: Number(network.chainId) });
    await checkForExistingAutId(address);
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
