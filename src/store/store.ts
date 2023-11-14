import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { Action, combineReducers } from 'redux';
import autSliceReducer, { initialState as initAutState } from './aut.reducer';
import userDataReducer, { initialState as initUserDataState } from './user-data.reducer';
import walletProvider from './wallet-provider';
import { stat } from 'fs';

const appReducer = combineReducers({
  aut: autSliceReducer,
  userData: userDataReducer,
  walletProvider,
});

type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState, action: Action) => {
  if (action.type === 'RESET_UI') {
    state = {
      ...state,
      aut: {
        ...initAutState,
        showDialog: state.aut.showDialog,
        novaAddress: state.aut.novaAddress,
        flowConfig: state.aut.flowConfig,
        useDev: state.aut.useDev,
        allowedRoleId: state.aut.allowedRoleId,
      },
      userData: {
        ...initUserDataState,
      },
    };
  }
  return appReducer(state, action);
};

export const resetUIState = { type: 'RESET_UI' };

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: rootReducer,
});

export default store;
