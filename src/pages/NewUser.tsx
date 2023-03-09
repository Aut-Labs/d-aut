import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { setJustJoining } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { ConnectorTypes, setSelectedNetwork } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import NetworkSelector from '../components/NetworkSelector';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { useEthers } from '@usedapp/core';
import { LoadingProgress } from '../components/LoadingProgress';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { account, deactivate } = useEthers();

  const checkForExistingAutId = async () => {
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
    deactivate();
    dispatch(setSelectedNetwork(null));
  }, []);

  const onConnected = async () => {
    await checkForExistingAutId();
  };

  const { selectingNetwork, setSelectingNetwork, changeConnector, changeNetwork, waitingForConfirmation } = useWeb3ReactConnectorHook({
    onConnected,
  });

  return (
    <>
      {waitingForConfirmation ? (
        <LoadingProgress />
      ) : (
        <>
          {selectingNetwork ? (
            <NetworkSelector onSelect={changeNetwork} onBack={() => setSelectingNetwork(false)} />
          ) : (
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
              <ConnectorBtn marginTop={66} setConnector={changeConnector} connectorType={ConnectorTypes.Metamask} />
              <ConnectorBtn marginTop={53} setConnector={changeConnector} connectorType={ConnectorTypes.WalletConnect} />
            </AutPageBox>
          )}
        </>
      )}
    </>
  );
};

export default NewUser;
