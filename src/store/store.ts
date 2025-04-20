import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';  // Import the auth slice reducer

const store = configureStore({
  reducer: {
    auth: authReducer,  // Set up the auth reducer to manage authentication state
  },
});

export type RootState = ReturnType<typeof store.getState>;  // Type for RootState
export type AppDispatch = typeof store.dispatch;  // Type for AppDispatch

export default store;
