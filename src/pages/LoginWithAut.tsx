import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppDispatch } from '../store/store.model';
import { checkAvailableNetworksAndGetAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { InternalErrorTypes } from '../utils/error-parser';
import { AutHeader } from '../components/AutHeader';
import { ConnectorTypes } from '../store/wallet-provider';
import ConnectorBtn from '../components/ConnectorButton';
import NetworkSelector from '../components/NetworkSelector';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';
import { pxToRem } from '../services/web3/utils';

const LoginWithSkillWallet: React.FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const onConnected = async () => {
    const result = await dispatch(checkAvailableNetworksAndGetAutId(null));
    if (result.payload === InternalErrorTypes.FoundAutIDOnMultipleNetworks) {
      history.push('/networks');
    }
    if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
      history.push('/unjoined');
    }
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
          <AutHeader logoId="new-user-logo" title=" WELCOME BACK" />
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

export default LoginWithSkillWallet;
