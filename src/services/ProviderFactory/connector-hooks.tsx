import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import AutSDK from '@aut-protocol/sdk';
import { NetworksConfig, SelectedNetwork, setSigner, setSelectedNetwork } from '../../store/wallet-provider';
import type { Connector } from '@web3-react/types';
import { EnableAndChangeNetwork } from './web3.network';
import { SDKBiconomyWrapper } from '@aut-protocol/sdk-biconomy';
import { DAOExpanderAddress, ResultState, setSelectedAddress, setStatus, updateErrorState } from '../../store/aut.reducer';
import { InternalErrorTypes } from '../../utils/error-parser';
import { ethers } from 'ethers';

export const useWeb3ReactConnectorHook = ({ onConnected = null }) => {
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const daoExpanderAddress = useSelector(DAOExpanderAddress);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const selectedNetwork = useSelector(SelectedNetwork);
  const [connectorLocal, setConnector] = useState<Connector>(null);
  const { isActive, provider, account, connector } = useWeb3React();

  const initializeSDK = async (signer: ethers.providers.JsonRpcSigner) => {
    const networkConfig = networks.find((n) => n.network === selectedNetwork);
    const sdk = AutSDK.getInstance();
    // const biconomy =
    //   networkConfig.biconomyApiKey &&
    //   new SDKBiconomyWrapper({
    //     enableDebugMode: true,
    //     apiKey: networkConfig.biconomyApiKey,
    //     contractAddresses: [networkConfig.contracts.daoExpanderRegistryAddress],
    //   });
    await sdk.init(
      signer,
      {
        daoExpanderAddress,
        autIDAddress: networkConfig.contracts.autIDAddress,
        daoExpanderRegistryAddress: networkConfig.contracts.daoExpanderRegistryAddress,
      }
      // biconomy
    );
  };

  useEffect(() => {
    const updateSigner = async () => {
      await dispatch(setSigner(provider.getSigner()));
      await initializeSDK(provider.getSigner());
      if (onConnected) {
        onConnected();
      }
    };
    if (provider && isActive && selectedNetwork) {
      updateSigner();
    }
  }, [isActive]);

  const switchNetwork = async (c: Connector, chainId: number) => {
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
      // await dispatch(setSelectedNetwork(null));
      // await c.deactivate();
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
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
      // await dispatch(setSelectedNetwork(null));
      // await c.deactivate();
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
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
