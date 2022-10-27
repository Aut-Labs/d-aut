import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { combineReducers } from 'redux';
import autSliceReducer, { initialState as initAutState } from './aut.reducer';
// import swUserDataReducer, { initialState as initUserDataState } from './sw-user-data.reducer';
import userDataReducer, { initialState as initUserDataState } from './user-data.reducer';
import walletProvider, { initialState as initWalletProviderState } from './wallet-provider';

const appReducer = combineReducers({
  aut: autSliceReducer,
  userData: userDataReducer,
  walletProvider,
});

const rootReducer = (state, action) => {
  if (action.type === 'RESET_UI') {
    state = {
      ...state,
      aut: {
        ...initAutState,
        showDialog: state.aut.showDialog,
        communityExtensionAddress: state.aut.communityExtensionAddress,
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
