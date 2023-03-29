import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { AutId } from '../services/ProviderFactory/web3.connectors';
import {
  checkAvailableNetworksAndGetAutId,
  checkIfAutIdExists,
  checkIfNameTaken,
  fetchCommunity,
  getAutId,
  joinCommunity,
  mintMembership,
} from '../services/web3/api';
import { BaseNFTModel } from '../services/web3/models';
import { FlowConfig } from '../types/d-aut-config';
import { OutputEventTypes } from '../types/event-types';
import { InternalErrorTypes } from '../utils/error-parser';
import { dispatchEvent } from '../utils/utils';
import { ActionPayload } from './action-payload';

export interface Community {
  name: string;
  // image: string;
  address?: string;
  description: string;
  roles: Role[];
  minCommitment: number;
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
  unjoinedCommunities?: Community[];
  selectedUnjoinedCommunityAddress?: string;
  daoExpanderAddress?: string;
  showDialog: boolean;
  status: ResultState;
  errorStateAction: string;
  transactionState: string;
  user: BaseNFTModel<any> & { address: string };
  userBadge: string;
  justJoin: boolean;
  provider: any;
  selectedAddress: any;
  isWalletConnect: boolean;
  flowConfig: FlowConfig;
  allowedRoleId: string;
  autIdsOnDifferentNetworks: AutId[];
}

export const initialState: AutState = {
  community: null,
  unjoinedCommunities: [],
  selectedUnjoinedCommunityAddress: null,
  daoExpanderAddress: null,
  showDialog: false,
  status: ResultState.Idle,
  errorStateAction: null,
  transactionState: null,
  user: null,
  userBadge: null,
  justJoin: false,
  provider: null,
  selectedAddress: null,
  isWalletConnect: false,
  autIdsOnDifferentNetworks: [],
  allowedRoleId: null,
  flowConfig: null,
};

export const autSlice = createSlice({
  name: 'aut',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: ActionPayload<any>) => {
      state.selectedAddress = action.payload;
    },
    setCommunityExtesnionAddress: (state, action: ActionPayload<string>) => {
      state.daoExpanderAddress = action.payload;
    },
    setFlowConfig: (state, action: ActionPayload<FlowConfig>) => {
      state.flowConfig = action.payload;
    },
    setAllowedRoleId: (state, action: ActionPayload<string>) => {
      state.allowedRoleId = action.payload;
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
    setUnjoinedCommunities(state, action) {
      state.unjoinedCommunities = action.payload;
    },
    setSelectedUnjoinedCommunityAddress(state, action) {
      state.selectedUnjoinedCommunityAddress = action.payload;
    },
    errorAction(state, action) {
      state.status = ResultState.Idle;
    },
    setUser(state, action: ActionPayload<any>) {
      state.user = action.payload;
    },
    setAutIdsOnDifferentNetworks(state, action: ActionPayload<AutId[]>) {
      state.autIdsOnDifferentNetworks = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        // console.log(action.payload);
        state.community = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(fetchCommunity.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(getAutId.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(getAutId.fulfilled, (state, action) => {
        state.showDialog = false;
        state.user = action.payload;
        dispatchEvent(OutputEventTypes.Connected, action.payload);
      })
      .addCase(getAutId.rejected, (state, action) => {
        if (action.payload === InternalErrorTypes.UserHasUnjoinedCommunities) {
          state.status = ResultState.Idle;
        } else {
          state.errorStateAction = action.payload as string;
          state.status = ResultState.Failed;
        }
      })
      .addCase(mintMembership.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(mintMembership.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(mintMembership.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(checkIfNameTaken.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(checkIfNameTaken.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(checkIfNameTaken.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(checkIfAutIdExists.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(checkIfAutIdExists.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(checkIfAutIdExists.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(joinCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(checkAvailableNetworksAndGetAutId.fulfilled, (state, action) => {
        state.showDialog = false;
        state.user = action.payload;
        dispatchEvent(OutputEventTypes.Connected, action.payload);
      })
      .addCase(checkAvailableNetworksAndGetAutId.rejected, (state, action) => {
        if (action.payload === InternalErrorTypes.FoundAutIDOnMultipleNetworks) {
          state.status = ResultState.Idle;
        } else {
          state.errorStateAction = action.payload as string;
          state.status = ResultState.Failed;
        }
      })
      .addCase(checkAvailableNetworksAndGetAutId.pending, (state) => {
        state.status = ResultState.Loading;
      });
  },
});

export const {
  setUser,
  setSelectedAddress,
  setJustJoining,
  setUnjoinedCommunities,
  setCommunityExtesnionAddress,
  showDialog,
  updateTransactionState,
  updateErrorState,
  errorAction,
  setSelectedUnjoinedCommunityAddress,
  setAutIdsOnDifferentNetworks,
  setStatus,
  setAllowedRoleId,
  setFlowConfig,
} = autSlice.actions;

export const DAOExpanderAddress = (state: any) => state.aut.daoExpanderAddress as string;

export const FlowMode = (state: any) => state.aut.flowConfig?.mode as string;

export const AllowedRoleId = (state: any) => state.aut.allowedRoleId as string;

export const CustomCongratsMessage = (state: any) => state.aut.flowConfig?.customCongratsMessage as string;

export const community = createSelector(
  (state) => state.aut.community,
  (community) => community as typeof initialState.community
);

export const autState = createSelector(
  (state) => state.aut,
  (aut) => aut as typeof initialState
);

export const loadingStatus = createSelector(
  (state) => state.aut.status,
  (status) => status as typeof initialState.status
);

export const user = createSelector(
  (state) => state.aut.user,
  (user) => user as typeof initialState.user
);

export const errorState = createSelector(
  (state) => state.aut.errorStateAction,
  (state) => state as typeof initialState.errorStateAction
);
// export const currentCommunity = createSelector(
//   (state) => state.swAuth.community as Community & PartnerAgreementKey,
//   (comm: Community & PartnerAgreementKey) => comm
// );

export default autSlice.reducer;
