import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { setJustJoining } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { ConnectorTypes, setSelectedNetwork } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { LoadingProgress } from '../components/LoadingProgress';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { connect, waitingUserConfirmation, isLoading } = useWeb3ReactConnectorHook();

  const checkForExistingAutId = async (account: string) => {
    const hasAutId = await dispatch(checkIfAutIdExists(account));
    if (hasAutId.meta.requestStatus !== 'rejected') {
      await dispatch(fetchCommunity());
      if (!hasAutId.payload) {
        await dispatch(setJustJoining(false));
        history.push('userdetails');
      } else {
        await dispatch(setJustJoining(true));
        history.push('role');
      }
    }
  };

  useEffect(() => {
    dispatch(setSelectedNetwork(null));
  }, []);

  const tryConnect = async (connectorType: string) => {
    const account = await connect(connectorType);
    if (account) {
      await checkForExistingAutId(account);
    }
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
            <AutHeader
              logoId="new-user-logo"
              title="Welcome"
              subtitle={
                <>
                  First, import your wallet <br /> & claim your Role in your DAO
                  {/* <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span> */}
                </>
              }
            />
            <ConnectorBtn marginTop={66} setConnector={tryConnect} connectorType={ConnectorTypes.Metamask} />
            <ConnectorBtn marginTop={53} setConnector={tryConnect} connectorType={ConnectorTypes.WalletConnect} />
          </AutPageBox>
        </>
      )}
    </>
  );
};

export default NewUser;
