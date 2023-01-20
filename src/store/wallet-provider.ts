import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { ethers } from 'ethers';
import { initializeConnectors, NetworkConfig } from '../services/ProviderFactory/web3.connectors';

export enum ConnectorTypes {
  WalletConnect = 'walletConnect',
  Metamask = 'metamask',
}

export interface WalletProviderState {
  signer: ethers.providers.JsonRpcSigner;
  selectedWalletType: 'metamask' | 'walletConnect';
  selectedNetwork: string;
  isOpen: boolean;
  networksConfig: NetworkConfig[];
  connectors: [MetaMask | WalletConnect, Web3ReactHooks][];
  wallets: any;
  alternativeRpc: string;
}

export const initialState: WalletProviderState = {
  signer: null,
  selectedWalletType: null,
  selectedNetwork: null,
  networksConfig: [],
  isOpen: false,
  connectors: [],
  wallets: {},
  alternativeRpc: null,
};

export const walletProviderSlice = createSlice({
  name: 'walletProvider',
  initialState,
  reducers: {
    setSigner(state, action) {
      state.signer = action.payload;
    },
    setAlternativeRpc(state, action) {
      state.alternativeRpc = action.payload;
    },
    setWallet(state, action) {
      state.selectedWalletType = action.payload;
    },
    setProviderIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setNetworks(state, action) {
      state.networksConfig = action.payload;
      const { metaMaskConnector, walletConnectConnector } = initializeConnectors(action.payload);
      const [metamask, metaMaskHooks] = metaMaskConnector;
      const [walletConnect, walletConnectHooks] = walletConnectConnector;

      const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
        [metamask, metaMaskHooks],
        [walletConnect, walletConnectHooks],
      ];
      state.wallets = {
        [ConnectorTypes.Metamask]: metaMaskConnector,
        [ConnectorTypes.WalletConnect]: walletConnectConnector,
      };
      state.connectors = connectors;
    },
    setSelectedNetwork(state, action) {
      state.selectedNetwork = action.payload as string;
    },
    resetWalletProviderState: () => initialState,
  },
});

export const { setSigner, setWallet, setProviderIsOpen, setNetworks, setSelectedNetwork, setAlternativeRpc } = walletProviderSlice.actions;

export const NetworkSelectorIsOpen = (state: any) => state.walletProvider.isOpen as boolean;
export const NetworksConfig = (state: any) => state.walletProvider.networksConfig as NetworkConfig[];
export const NetworkConnectors = (state: any) => state.walletProvider.connectors as [MetaMask | WalletConnect, Web3ReactHooks][];
export const SelectedWalletType = (state: any) => state.walletProvider.selectedWalletType as string;
export const AlternativeRPC = (state: any) => state.walletProvider.alternativeRpc as string;
export const SelectedNetwork = (state: any) => state.walletProvider.selectedNetwork as string;
export const NetworkSigner = (state: any) => state.walletProvider.signer as ethers.providers.JsonRpcSigner;
export const NetworkWalletConnectors = (state: any) => state.walletProvider.wallets as any;

export const IsConnected = createSelector(NetworkSigner, SelectedNetwork, (signer, selectedNetwork) => {
  return !!signer && !!selectedNetwork;
});

export const NetworkConnector = (connectorName: string) => createSelector(NetworkWalletConnectors, (c) => c[connectorName]);

export default walletProviderSlice.reducer;
