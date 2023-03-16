import { useAppDispatch } from '../store/store.model';
import { getAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { AutHeader } from '../components/AutHeader';
import { ConnectorTypes } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import { useEthers } from '@usedapp/core';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { LoadingProgress } from '../components/LoadingProgress';

const LoginWithAut: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { connect, waitingUserConfirmation, isLoading } = useWeb3ReactConnectorHook();

  const tryConnect = async (connectorType) => {
    const account = await connect(connectorType);
    if (account) {
      await dispatch(getAutId(account));
    }

    // if (result.payload === InternalErrorTypes.FoundAutIDOnMultipleNetworks) {
    //   history.push('/networks');
    // }
    // if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
    //   history.push('/unjoined');
    // }
  };

  return (
    <>
      {isLoading || waitingUserConfirmation ? (
        <>
          {/* {waitingUserConfirmation && (
            <Typography m="0" color="white" variant="subtitle1">
              Waiting confirmation...
            </Typography>
          )} */}
          <LoadingProgress />
        </>
      ) : (
        <>
          {/* {selectingNetwork ? (
            <NetworkSelector onSelect={changeNetwork} onBack={() => setSelectingNetwork(false)} />
          ) : (
            
          )} */}
          <AutPageBox>
            <AutHeader logoId="new-user-logo" title="Welcome back" />
            <ConnectorBtn marginTop={93} setConnector={tryConnect} connectorType={ConnectorTypes.Metamask} />
            <ConnectorBtn marginTop={53} setConnector={tryConnect} connectorType={ConnectorTypes.WalletConnect} />
          </AutPageBox>
        </>
      )}
    </>
  );
};

export default LoginWithAut;
