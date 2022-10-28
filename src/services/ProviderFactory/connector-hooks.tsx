import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import { NetworksConfig, SelectedNetwork, setSigner, setSelectedNetwork } from '../../store/wallet-provider';
import type { Connector } from '@web3-react/types';
import { EnableAndChangeNetwork } from './web3.network';
import { ResultState, setSelectedAddress, setStatus, updateErrorState } from '../../store/aut.reducer';
import { InternalErrorTypes } from '../../utils/error-parser';

export const useWeb3ReactConnectorHook = ({ onConnected = null }) => {
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const selectedNetwork = useSelector(SelectedNetwork);
  const [connectorLocal, setConnector] = useState<Connector>(null);
  const { isActive, provider, account, connector } = useWeb3React();

  useEffect(() => {
    if (provider && isActive && selectedNetwork) {
      dispatch(setSigner(provider.getSigner()));
      dispatch(setSelectedAddress(account));
      if (onConnected) {
        console.log('ONconnected');
        onConnected();
      }
    }
  }, [provider, isActive, selectedNetwork]);

  const switchNetwork = async (c: Connector, chainId: number) => {
    console.log('switchNetwork');
    if (!c) {
      return;
    }
    await c.deactivate();
    const config = networks.find((n) => n.chainId?.toString() === chainId?.toString());
    await dispatch(setSelectedNetwork(config.network));
    try {
      await c.activate();
      await EnableAndChangeNetwork(c.provider, config);
    } catch (error) {
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      console.log(error);
    }
  };

  const switchNetworkLocalConnector = async (chainId: number) => {
    await connectorLocal.deactivate();
    const config = networks.find((n) => n.chainId?.toString() === chainId?.toString());
    await dispatch(setSelectedNetwork(config.network));
    try {
      await connectorLocal.activate();
      await EnableAndChangeNetwork(connectorLocal.provider, config);
    } catch (error) {
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      console.log(error);
    }
  };

  const changeConnector = async (c: Connector) => {
    // @ts-ignore
    const foundChainId = Number(c?.provider?.chainId);
    const index = networks.map((n) => n.chainId?.toString()).indexOf(foundChainId?.toString());
    const chainAllowed = index !== -1;
    setConnector(c);
    if (chainAllowed) {
      await switchNetwork(c, foundChainId);
    } else {
      setSelectingNetwork(true);
    }
  };

  const changeNetwork = async (chainId) => {
    await dispatch(setStatus(ResultState.Loading));
    await switchNetworkLocalConnector(chainId);
  };

  return { changeNetwork, selectingNetwork, setSelectingNetwork, changeConnector };
};
