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
      state.selectedNetwork = action.payload.network.chainName.toLowerCase();
      state.networkConfig = action.payload;
    },
    resetWalletProviderState: () => initialState,
  },
});

export const setNetwork = createAsyncThunk('config/fetch', async (network: string, thunkAPI) => {
  const ntwrk = network === 'goerli' ? network : 'mumbai';
  const state = thunkAPI.getState() as any;
  const selectedNetwork = getNetwork(ntwrk);
  const response = await fetch(`https://api.skillwallet.id/api/autid/config/${ntwrk}`);
  const data = await response.json();
  selectedNetwork.autIdAddress = data.autIDAddress;
  selectedNetwork.communityRegistryAddress = data.daoExpanderRegistryAddress;
  await thunkAPI.dispatch(walletProviderSlice.actions.setNetworkConfig(selectedNetwork));
  return response;
});

export const { setSigner, setWallet, setProviderIsOpen } = walletProviderSlice.actions;

export const NetworkSelectorIsOpen = (state: any) => state.walletProvider.isOpen as boolean;
export const SelectedWalletType = (state: any) => state.walletProvider.selectedWalletType as string;
export const SelectedNetwork = (state: any) => state.walletProvider.selectedNetwork as string;
export const NetworkSigner = (state: any) => state.walletProvider.signer as ethers.providers.JsonRpcSigner;
export const SelectedNetworkConfig = (state: any) => state.walletProvider.networkConfig as any;

export default walletProviderSlice.reducer;
