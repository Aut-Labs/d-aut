import { createSelector, createSlice } from '@reduxjs/toolkit';
import { NetworkConfig } from '../types/network';

export interface WalletProviderState {
  selectedNetwork: NetworkConfig;
  networksConfig: NetworkConfig[];
  customIpfsGateway: string;
}

export const initialState: WalletProviderState = {
  selectedNetwork: null,
  networksConfig: [],
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
    setNetworks(state, action) {
      state.networksConfig = action.payload;
    },
    setCustomIpfsGateway(state, action) {
      state.customIpfsGateway = action.payload as string;
    },
    resetWalletProviderState: () => initialState,
  },
});

export const { setCustomIpfsGateway, updateWalletProviderState, setNetworks } = walletProviderSlice.actions;

export const NetworksConfig = (state: any) => state.walletProvider.networksConfig as NetworkConfig[];
export const selectedNetwork = (state: any) => state.walletProvider.selectedNetwork as string;
export const IPFSCusomtGateway = (state: any) => state.walletProvider.customIpfsGateway as string;

export const SelectedNetwork = createSelector(NetworksConfig, selectedNetwork, (networks, networkName) =>
  networks.find((r) => r.network === networkName)
);
export default walletProviderSlice.reducer;
