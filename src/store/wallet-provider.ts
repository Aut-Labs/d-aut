import { createSelector, createSlice } from '@reduxjs/toolkit';
import { JsonRpcSigner } from '@ethersproject/providers';
import { NetworkConfig } from '../services/ProviderFactory/web3.connectors';

export interface WalletProviderState {
  signer: JsonRpcSigner;
  selectedWalletType: 'metamask' | 'walletConnect';
  selectedNetwork: NetworkConfig;
  networksConfig: NetworkConfig[];
  isOpen: boolean;
  wallets: any;
  isAuthorised: boolean;
  customIpfsGateway: string;
}

export const initialState: WalletProviderState = {
  signer: null,
  selectedWalletType: null,
  selectedNetwork: null,
  isOpen: false,
  isAuthorised: false,
  networksConfig: [],
  wallets: {},
  customIpfsGateway: null,
};

export const walletProviderSlice = createSlice({
  name: 'walletProvider',
  initialState,
  reducers: {
    updateWalletProviderState(state, action) {
      Object.keys(action.payload).forEach((key: string) => {
        state[key] = action.payload[key];
      });
    },
    setSigner(state, action) {
      state.signer = action.payload;
    },
    setWallet(state, action) {
      state.selectedWalletType = action.payload;
    },
    setProviderIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setSelectedNetwork(state, action) {
      state.selectedNetwork = action.payload as NetworkConfig;
    },
    setNetworks(state, action) {
      state.networksConfig = action.payload;
    },
    setCustomIpfsGateway(state, action) {
      state.customIpfsGateway = action.payload as string;
    },
    resetWalletProviderState: () => initialState,
  },
});

export const { setSigner, setCustomIpfsGateway, setWallet, setSelectedNetwork, updateWalletProviderState, setNetworks, setProviderIsOpen } =
  walletProviderSlice.actions;

export const IsAuthorised = (state: any) => state.walletProvider.isAuthorised as boolean;

export const StartFromScratch = (state: any) => state.walletProvider.startFromScratch as boolean;

export const NetworkSelectorIsOpen = (state: any) => state.walletProvider.isOpen as boolean;
export const SelectedWalletType = (state: any) => state.walletProvider.selectedWalletType as string;
export const NetworkSigner = (state: any) => state.walletProvider.signer as JsonRpcSigner;
export const NetworksConfig = (state: any) => state.walletProvider.networksConfig as NetworkConfig[];
export const NetworkWalletConnectors = (state: any) => state.walletProvider.wallets as any;
export const SelectedNetwork = (state: any) => state.walletProvider.selectedNetwork as string;
export const IPFSCusomtGateway = (state: any) => state.walletProvider.customIpfsGateway as string;

export const SelectedNetworkConfig = createSelector(NetworksConfig, SelectedNetwork, (networks, networkName) =>
  networks.find((r) => r.network === networkName)
);
export const NetworkConnector = (connectorName: string) => createSelector(NetworkWalletConnectors, (x1) => x1[connectorName]);

export default walletProviderSlice.reducer;
