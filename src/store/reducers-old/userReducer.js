import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    curruntUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    signupStart: (state) => {
      state.isFetching = true;
    },
    signupSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.curruntUser = action.payload;
    },
    signupFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.curruntUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    getClientesStart: (state) => {
      state.isFetching = true;
    },
    getClientesSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.curruntUser = action.payload;
    },
    getClientesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    getImageStart: (state) => {
      state.isFetching = true;
    },
    getImageSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.curruntUser = action.payload;
    },
    getImageFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.curruntUser = null;
    },
  },
});

export const {
  getImageStart,
  getImageSuccess,
  getImageFailure,
  getProfileStart,
  getProfileSuccess,
  getProfileFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout,
} = userSlice.actions;
export default userSlice.reducer;
