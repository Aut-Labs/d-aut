import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Interface } from 'ethers/lib/utils';
import { createSelector } from 'reselect';
import { ActionPayload } from './action-payload';

export interface UserData {
  username?: string;
  picture?: string;
  badge?: string;
  role?: number;
  roleName?: string;
  commitment: number;
  isLoggedIn: boolean;
}

export const initialState: UserData = {
  username: '',
  picture: undefined,
  badge: undefined,
  role: undefined,
  roleName: undefined,
  commitment: 0,
  isLoggedIn: false,
};

export interface UserState {
  username?: string;
  commitment?: number;
  role?: number;
  roleName?: string;
  picture?: string;
  badge?: string;
  isLoggedIn?: boolean;
}

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData(state, action: ActionPayload<UserState>) {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
});

export const { setUserData } = userDataSlice.actions;

// export const currentUserState = createSelector(
//   (state) => {
//     return {
//       username: state.swUserData.username,
//       profileImageUrl: state.swUserData.profileImageUrl,
//       isLoggedIn: state.swUserData.isLoggedIn,
//     };
//   },
//   (userState) => userState
// );

export const userData = (state) => state.userData as typeof initialState;

export default userDataSlice.reducer;
