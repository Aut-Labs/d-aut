import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { checkIfAutIdExists, checkIfNameTaken, fetchCommunity, getAutId, joinCommunity, mintMembership } from '../services/web3/api';
import { BaseNFTModel } from '../services/web3/models';
import { OutputEventTypes } from '../types/event-types';
import { InternalErrorTypes } from '../utils/error-parser';
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
  userBadge: string;
  justJoin: boolean;
}

export const initialState: AutState = {
  community: { name: 'SASSS', description: 'null', roles: null },
  communityExtensionAddress: null,
  showDialog: false,
  status: ResultState.Idle,
  errorStateAction: null,
  transactionState: null,
  user: null,
  userBadge: null,
  justJoin: false,
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
    setJustJoining(state, action) {
      state.justJoin = action.payload;
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
      })
      .addCase(checkIfNameTaken.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(checkIfNameTaken.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(checkIfNameTaken.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(checkIfAutIdExists.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(checkIfAutIdExists.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(checkIfAutIdExists.rejected, (state, action) => {
        state.status = ResultState.Failed;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(joinCommunity.rejected, (state) => {
        state.status = ResultState.Failed;
      })
      .addCase(joinCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      });
  },
});

export const { setJustJoining, setCommunityExtesnionAddress, showDialog, updateTransactionState, updateErrorState, errorAction } =
  autSlice.actions;

export const community = createSelector(
  (state) => state.aut.community,
  (community) => community
);

export const autState = createSelector(
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
