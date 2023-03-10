import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store.model';
import AutSDK, { AutID } from '@aut-labs-private/sdk';
import { NetworksConfig, SelectedWalletType, setSelectedNetwork, updateWalletProviderState } from '../../store/wallet-provider';
import { EnableAndChangeNetwork } from './web3.network';
import { DAOExpanderAddress, ResultState, setStatus, updateErrorState } from '../../store/aut.reducer';
import { InternalErrorTypes } from '../../utils/error-parser';
import { ethers } from 'ethers';
import { Connector, useConnector, useEthers } from '@usedapp/core';
import { authoriseWithWeb3 } from '../web3/auth.api';
import { NetworkConfig } from './web3.connectors';
import { SDKBiconomyWrapper } from '@aut-labs-private/sdk-biconomy';

export const useWeb3ReactConnectorHook = ({ onConnected = null }) => {
  const dispatch = useAppDispatch();
  const networks = useSelector(NetworksConfig);
  const daoExpanderAddress = useSelector(DAOExpanderAddress);
  const wallet = useSelector(SelectedWalletType);
  const [tryEagerConnect, setTryEagerConnect] = useState(false);
  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const { connector, activate } = useConnector();
  const [waitingForConfirmation, setIsWaitingForCofirmation] = useState(false);
  const { activateBrowserWallet, switchNetwork, account } = useEthers();

  const initializeSDK = async (network: NetworkConfig, signer: ethers.providers.JsonRpcSigner) => {
    const sdk = AutSDK.getInstance();

    let autIdContractAddress = network?.contracts?.autIDAddress;

    const biconomy =
      network?.biconomyApiKey &&
      new SDKBiconomyWrapper({
        enableDebugMode: true,
        apiKey: network.biconomyApiKey,
        contractAddresses: [autIdContractAddress],
      });

    // If dao expander is provided then to ensure is the correct autId address
    // we will fetch contract address from daoExpanderAddress contract
    if (daoExpanderAddress) {
      await sdk.init(
        signer,
        {
          daoExpanderAddress,
        },
        biconomy
      );
      const result = await sdk.daoExpander.contract.getAutIDContractAddress();
      autIdContractAddress = result?.data;
      sdk.autID = sdk.initService<AutID>(AutID, autIdContractAddress);
    } else {
      await sdk.init(
        signer,
        {
          autIDAddress: autIdContractAddress,
        },
        biconomy
      );
    }
  };

  const activateNetwork = async (network: NetworkConfig, conn: Connector) => {
    try {
      setTryEagerConnect(false);
      setIsWaitingForCofirmation(true);
      await activate(conn);
      await switchNetwork(+network.chainId);
      if (conn.name === 'metamask') {
        // @ts-ignore
        const { provider } = conn.provider;
        await EnableAndChangeNetwork(provider, network);
      }
      const signer = conn?.provider?.getSigner();

      const isAuthorised = await authoriseWithWeb3(signer);
      if (isAuthorised) {
        const itemsToUpdate = {
          isAuthorised,
          sdkInitialized: true,
          selectedWalletType: wallet,
          isOpen: false,
          selectedNetwork: network.network,
          signer,
        };
        if (!wallet) {
          delete itemsToUpdate.selectedWalletType;
        }
        await dispatch(updateWalletProviderState(itemsToUpdate));
        await initializeSDK(network, signer as ethers.providers.JsonRpcSigner);
        onConnected(account);
      } else {
        const itemsToUpdate = {
          isAuthorised: false,
          sdkInitialized: false,
          selectedWalletType: null,
          isOpen: false,
          selectedNetwork: null,
          signer: null,
        };
        await dispatch(updateWalletProviderState(itemsToUpdate));
        await dispatch(setSelectedNetwork(null));
        await dispatch(setStatus(ResultState.Failed));
        dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      }
    } catch (error) {
      await dispatch(setSelectedNetwork(null));
      await dispatch(setStatus(ResultState.Failed));
      dispatch(updateErrorState(InternalErrorTypes.FailedToSwitchNetwork));
      console.error(error, 'error');
    } finally {
      setIsWaitingForCofirmation(false);
    }
  };

  const tryConnect = async () => {
    const [config] = networks.filter((n) => !n.disabled);
    // .find(
    //   // (n) => n.chainId?.toString() === chainId?.toString()
    //   (n) => n.chainId?.toString() === chainId?.toString()
    // );
    if (config && connector?.connector) {
      await activateNetwork(config, connector.connector);
    } else {
      setTryEagerConnect(false);
      // setSelectingNetwork(true);
    }
  };

  const changeConnector = async (connectorType: string) => {
    activateBrowserWallet({ type: connectorType });
    if (!connector?.connector) {
      setTryEagerConnect(true);
    } else {
      await tryConnect();
    }
  };

  const canConnectEagerly = useMemo(() => {
    return !!tryEagerConnect && !!connector?.connector && account;
  }, [connector, tryEagerConnect, account]);

  useEffect(() => {
    if (canConnectEagerly) {
      tryConnect();
    }
  }, [canConnectEagerly]);

  const changeNetwork = async (selectedChainId: number) => {
    const network = networks.find((n) => n.chainId?.toString() === selectedChainId?.toString());
    await dispatch(setStatus(ResultState.Loading));
    await activateNetwork(network, connector.connector);
    // setSelectingNetwork(false);
  };

  return { changeNetwork, changeConnector, setSelectingNetwork, selectingNetwork, waitingForConfirmation };
};
