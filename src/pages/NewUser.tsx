import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppDispatch } from '../store/store.model';
import { AutPageBox } from '../components/AutPageBox';
import { checkIfAutIdExists, fetchCommunity } from '../services/web3/api';
import { setJustJoining } from '../store/aut.reducer';
import { AutHeader } from '../components/AutHeader';
import { ConnectorTypes } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import NetworkSelector from '../components/NetworkSelector';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';

const NewUser: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const checkForExistingAutId = async () => {
    const hasAutId = await dispatch(checkIfAutIdExists());
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

  const onConnected = async () => {
    await checkForExistingAutId();
  };

  const { selectingNetwork, changeConnector, setSelectingNetwork, changeNetwork } = useWeb3ReactConnectorHook({ onConnected });

  return (
    <>
      {selectingNetwork ? (
        <NetworkSelector
          onSelect={async (chainId) => {
            await changeNetwork(chainId);
            setSelectingNetwork(false);
          }}
          onBack={() => {
            setSelectingNetwork(false);
          }}
        />
      ) : (
        <AutPageBox>
          <AutHeader
            logoId="new-user-logo"
            title="WELCOME"
            subtitle={
              <>
                First, import your wallet <br /> & claim your Role in your DAO
                {/* <span style={{ textDecoration: 'underline' }}>{autData.community?.name}!</span> */}
              </>
            }
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ConnectorBtn marginTop={29} setConnector={changeConnector} connectorType={ConnectorTypes.Metamask} />
            <ConnectorBtn marginTop={30} setConnector={changeConnector} connectorType={ConnectorTypes.WalletConnect} />
          </Box>
        </AutPageBox>
      )}
    </>
  );
};

export default NewUser;
