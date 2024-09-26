// src/redux/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../../types/api';

type SignInResponse = components['schemas']['SignInResponse'];

interface AuthState {
  user: SignInResponse["user"] | null;
  token: SignInResponse["access_token"] | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user?: SignInResponse["user"]; token?: SignInResponse["access_token"] }>
    ) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      if (action.payload.token) {
        state.token = action.payload.token;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
