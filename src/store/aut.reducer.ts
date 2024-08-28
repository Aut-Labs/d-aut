import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { checkIfAutIdExists, checkIfNameTaken, fetchHub, loginToAutId, joinHub, mintMembership } from '../services/web3/api';
import { FlowConfig, FlowConfigMode } from '../types/d-aut-config';
import { OutputEventTypes } from '../types/event-types';
import { InternalErrorTypes } from '../utils/error-parser';
import { dispatchEvent } from '../utils/utils';
import { ActionPayload } from './action-payload';
import { DAutHub } from '../interfaces/hub.model';
import { DAutAutID } from '../interfaces/autid.model';

export interface Role {
  id: number;
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
  hub?: DAutHub;
  unjoinedHubs?: DAutHub[];
  selectedUnjoinedHubAddress?: string;
  hubAddress?: string;
  showDialog: boolean;
  status: ResultState;
  errorStateAction: string;
  transactionState: string;
  user: DAutAutID;
  userBadge: string;
  justJoin: boolean;
  provider: any;
  selectedAddress: any;
  isWalletConnect: boolean;
  flowConfig: FlowConfig;
  allowedRoleId: string;
  useDev: boolean;
}

export const initialState: AutState = {
  hub: new DAutHub(),
  unjoinedHubs: [],
  selectedUnjoinedHubAddress: null,
  hubAddress: null,
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
  allowedRoleId: null,
  flowConfig: null,
  useDev: false,
};

export const autSlice = createSlice({
  name: 'aut',
  initialState,
  reducers: {
    updateAutState(state, action: ActionPayload<Partial<AutState>>) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
    setSelectedAddress: (state, action: ActionPayload<any>) => {
      state.selectedAddress = action.payload;
    },
    setHubExtensionAddress: (state, action: ActionPayload<string>) => {
      state.hubAddress = action.payload;
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
    setUnjoinedHubs(state, action) {
      state.unjoinedHubs = action.payload;
    },
    setSelectedUnjoinedHubAddress(state, action) {
      state.selectedUnjoinedHubAddress = action.payload;
    },
    errorAction(state, action) {
      state.status = ResultState.Idle;
    },
    setUser(state, action: ActionPayload<any>) {
      state.user = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setUseDev(state, action) {
      state.useDev = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHub.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchHub.fulfilled, (state, action) => {
        state.hub = action.payload;
        state.status = ResultState.Idle;
      })
      .addCase(fetchHub.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(loginToAutId.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(loginToAutId.fulfilled, (state, action) => {
        state.showDialog = false;
        state.user = action.payload;
        dispatchEvent(OutputEventTypes.Connected, action.payload);
      })
      .addCase(loginToAutId.rejected, (state, action) => {
        if (action.payload === InternalErrorTypes.UserHasUnjoinedHubs) {
          state.status = ResultState.Idle;
          state.user = null;
          window.localStorage.removeItem('aut-data');
        } else {
          state.errorStateAction = action.payload as string;
          state.status = ResultState.Failed;
          state.user = null;
          window.localStorage.removeItem('aut-data');
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
      .addCase(joinHub.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
      })
      .addCase(joinHub.rejected, (state, action) => {
        state.errorStateAction = action.payload as string;
        state.status = ResultState.Failed;
      })
      .addCase(joinHub.pending, (state) => {
        state.status = ResultState.Loading;
      });
  },
});

export const {
  setUser,
  setSelectedAddress,
  setJustJoining,
  setUnjoinedHubs,
  setHubExtensionAddress,
  showDialog,
  updateTransactionState,
  updateErrorState,
  errorAction,
  setSelectedUnjoinedHubAddress,
  setStatus,
  setAllowedRoleId,
  setFlowConfig,
  setUseDev,
  updateAutState,
} = autSlice.actions;

export const HubAddress = (state: any) => state.aut.hubAddress as string;

export const FlowMode = (state: any) => state.aut.flowConfig?.mode as FlowConfigMode;

export const UsingDev = (state: any) => state.aut.useDev as boolean;

export const AllowedRoleId = (state: any) => state.aut.allowedRoleId as number;

export const CustomCongratsMessage = (state: any) => state.aut.flowConfig?.customCongratsMessage as string;

export const HubData = createSelector(
  (state) => state.aut.hub,
  (hub) => hub as typeof initialState.hub
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

export const IsOpen = createSelector(
  (state) => state.aut.showDialog as boolean,
  (showDialog) => showDialog as typeof initialState.showDialog
);

export default autSlice.reducer;
