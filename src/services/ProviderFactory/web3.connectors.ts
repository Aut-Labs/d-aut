import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';

export interface NetworkContracts {
  autIDAddress: string;
  daoExpanderRegistryAddress: string;
  daoExpanderFactoryAddress: string;
  hackerDaoAddress: string;
  daoTypesAddress: string;
}

export interface NetworkConfig {
  networkName: string;
  chainId: string | number;
  rpcUrls: string[];
  explorerUrls: string[];
  contracts: NetworkContracts;
  biconomyApiKey?: string;
}

export interface AutId {
  tokenId: string;
  metadataUri: string;
  network: string;
}

export const initializeConnectors = (networks: NetworkConfig[]) => {
  const { supportedChainIds, rpcUrls } = networks.reduce(
    (prev, curr) => {
      prev.supportedChainIds = [...prev.supportedChainIds, Number(curr.chainId)];
      prev.rpcUrls = {
        ...prev.rpcUrls,
        [curr.chainId]: curr.rpcUrls.join('|'),
      };
      return prev;
    },
    {
      supportedChainIds: [],
      rpcUrls: {},
    }
  );

  const metaMaskConnector: [MetaMask, any, any] = initializeConnector<MetaMask>((actions) => new MetaMask(actions), supportedChainIds);

  const walletConnectConnector: [WalletConnect, any, any] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect(actions, {
        qrcode: true,
        bridge: 'https://bridge.walletconnect.org',
        rpc: rpcUrls,
      }),
    supportedChainIds
  );

  return {
    metaMaskConnector,
    walletConnectConnector,
  };
};
