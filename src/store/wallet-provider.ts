import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { debug } from 'console';
import { ethers } from 'ethers';
import { env, getNetwork } from '../services/web3/env';

export interface WalletProviderState {
  signer: ethers.providers.JsonRpcSigner;
  selectedWalletType: 'metamask' | 'walletConnect';
  selectedNetwork: string;
  networkConfig: any;
  isOpen: boolean;
}

const initialState: WalletProviderState = {
  signer: null,
  selectedWalletType: null,
  selectedNetwork: null,
  networkConfig: null,
  isOpen: false,
};

export const walletProviderSlice = createSlice({
  name: 'walletProvider',
  initialState,
  reducers: {
    setSigner(state, action) {
      state.signer = action.payload;
    },
    setWallet(state, action) {
      state.selectedWalletType = action.payload;
    },
    setProviderIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    setNetworkConfig(state, action) {
      state.networkConfig = action.payload;
    },
    resetWalletProviderState: () => initialState,
  },
});

export const setNetwork = createAsyncThunk('config/fetch', async (network: string, thunkAPI) => {
  const state = thunkAPI.getState() as any;
  const selectedNetwork = getNetwork(network);
  const response = await fetch(`https://api.skillwallet.id/api/autid/config/${network}`);
  const data = await response.json();
  selectedNetwork.autIdAddress = data.autIDAddress;
  selectedNetwork.communityRegistryAddress = data.daoExpanderRegistryAddress;
  // state.walletProvider.networkConfig = selectedNetwork;
  // walletProvider.networkConfig = selectedNetwork;
  await thunkAPI.dispatch(walletProviderSlice.actions.setNetworkConfig(selectedNetwork));
  return response;
});

export const { setSigner, setWallet, setProviderIsOpen } = walletProviderSlice.actions;

export const NetworkSelectorIsOpen = (state: any) => state.walletProvider.isOpen as boolean;
export const SelectedWalletType = (state: any) => state.walletProvider.selectedWalletType as string;
export const NetworkSigner = (state: any) => state.walletProvider.signer as ethers.providers.JsonRpcSigner;
export const SelectedNetworkConfig = (state: any) => state.walletProvider.networkConfig as any;

export default walletProviderSlice.reducer;
