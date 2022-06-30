import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { fetchCommunity, getAutId, injectMetamask, mintMembership } from '../services/web3/api';
import { BaseNFTModel } from '../services/web3/models';
import { OutputEventTypes } from '../types/event-types';
import { dispatchEvent } from '../utils/utils';
import { ActionPayload } from './action-payload';

export interface Community {
  name: string;
  // image: string;
  description: string;
  roles: Role[];
}

export interface Role {
  id: string;
  roleName: string;
}

export enum ResultState {
  'Idle' = 'Idle',
  'Loading' = 'Loading',
  'Updating' = 'Updating',
  'Failed' = 'Failed',
  'Success' = 'Success',
}

export interface AutState {
  community?: Community;
  communityExtensionAddress: string;
  showDialog: boolean;
  status: ResultState;
  errorStateAction: string;
  transactionState: string;
  user: BaseNFTModel<any>;
}

export const initialState: AutState = {
  community: null,
  communityExtensionAddress: null,
  showDialog: false,
  status: ResultState.Idle,
  errorStateAction: null,
  transactionState: null,
  user: null,
};

export const autSlice = createSlice({
  name: 'aut',
  initialState,
  reducers: {
    setCommunityExtesnionAddress: (state, action: ActionPayload<string>) => {
      state.communityExtensionAddress = action.payload;
    },
    showDialog: (state, action: ActionPayload<boolean>) => {
      state.showDialog = action.payload;
    },
    updateTransactionState(state, action) {
      state.transactionState = action.payload;
    },
    updateErrorState(state, action) {
      state.errorStateAction = action.payload;
    },
    errorAction(state, action) {
      state.status = ResultState.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      // get community
      .addCase(fetchCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        console.log(action.payload);
        state.community = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(fetchCommunity.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(getAutId.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getAutId.fulfilled, (state, action) => {
        state.showDialog = false;
        console.log(action.payload);
        state.user = action.payload;
        dispatchEvent(OutputEventTypes.Connected, action.payload);
      })
      .addCase(getAutId.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(mintMembership.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(mintMembership.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(mintMembership.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  },
});

export const { setCommunityExtesnionAddress, showDialog, updateTransactionState, updateErrorState, errorAction } = autSlice.actions;

export const community = createSelector(
  (state) => state.aut.community,
  (community) => community
);

export const autUiState = createSelector(
  (state) => state.aut,
  (aut) => aut as typeof initialState
);

export const loadingStatus = createSelector(
  (state) => state.aut.status,
  (status) => status
);

export const user = createSelector(
  (state) => state.aut.user,
  (user) => user
);

export const errorState = createSelector(
  (state) => state.aut.errorStateAction,
  (state) => state
);
// export const currentCommunity = createSelector(
//   (state) => state.swAuth.community as Community & PartnerAgreementKey,
//   (comm: Community & PartnerAgreementKey) => comm
// );

export default autSlice.reducer;
