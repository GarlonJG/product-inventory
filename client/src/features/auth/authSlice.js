// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null, // in-memory only!
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user || null;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;