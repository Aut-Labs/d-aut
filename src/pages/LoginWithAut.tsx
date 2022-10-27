import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { autState, setSelectedAddress } from '../store/aut.reducer';
import { Box } from '@mui/material';
import { useAppDispatch } from '../store/store.model';
import { checkAvailableNetworksAndGetAutId } from '../services/web3/api';
import { AutPageBox } from '../components/AutPageBox';
import { InternalErrorTypes } from '../utils/error-parser';
import { AutHeader } from '../components/AutHeader';
import { useSelector } from 'react-redux';
import { ConnectorTypes, IsConnected, NetworksConfig, NetworkWalletConnectors, SelectedNetwork } from '../store/wallet-provider';
import { useWeb3React } from '@web3-react/core';
import ConnectorBtn from '../components/ConnectorButton';
import type { Connector } from '@web3-react/types';
import NetworkSelector from '../components/NetworkSelector';
import { EnableAndChangeNetwork } from '../services/ProviderFactory/web3.network';
import { useWeb3ReactConnectorHook } from '../services/ProviderFactory/connector-hooks';

const LoginWithSkillWallet: React.FunctionComponent = (props) => {
  const dispatch = useAppDispatch();
  const autData = useSelector(autState);
  // const [selectingNetwork, setSelectingNetwork] = useState(false);
  const networks = useSelector(NetworksConfig);
  const selectedNetwork = useSelector(SelectedNetwork);
  const [connector, setConnector] = useState<Connector>(null);
  const connectors = useSelector(NetworkWalletConnectors);
  const history = useHistory();
  const { isActive, provider, account, chainId } = useWeb3React();
  const isConnected = useSelector(IsConnected);

  // useEffect(() => {
  //   const activate = async () => {
  //     if (isActive && isConnected) {
  //       await dispatch(setSelectedAddress(account));
  //       const result = await dispatch(checkAvailableNetworksAndGetAutId(null));
  //       if (result.payload === InternalErrorTypes.FoundAutIDOnMultipleNetworks) {
  //         // await connector.deactivate();
  //         history.push('/networks');
  //       }
  //       if (result.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
  //         history.push('/unjoined');
  //       }
  //     }
  //   };
  //   activate();
  // }, [isActive, isConnected]);

  const onConnected = async () => {
    // await dispatch(setSelectedAddress(account));
    const result = await dispatch(checkAvailableNetworksAndGetAutId(null));
    if (result.payload === InternalErrorTypes.FoundAutIDOnMultipleNetworks) {
      // await connector.deactivate();
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
            <ConnectorBtn setConnector={changeConnector} connectorType={ConnectorTypes.Metamask} />
            <ConnectorBtn setConnector={changeConnector} connectorType={ConnectorTypes.WalletConnect} />
          </Box>
        </AutPageBox>
      )}
    </>
  );
};

export default LoginWithSkillWallet;
