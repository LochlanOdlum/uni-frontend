import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from './slices/authSlice';
import homeReducer from './slices/homeSlice';
import { loadAuthState, saveAuthState } from './localStorage';

// Load persisted state from localStorage
const preloadedState = {
  auth: loadAuthState(),
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    home: homeReducer,
  },
  preloadedState, // Set the preloaded state for the auth slice
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Subscribe to store changes and persist auth state
store.subscribe(() => {
  saveAuthState(store.getState().auth);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
