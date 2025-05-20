import { createSlice } from "@reduxjs/toolkit";

const AgentSlice = createSlice({
  name: "agent",
  initialState: {
    currentAgents: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    getAgentsStart: (state) => {
      state.isFetching = true;
    },
    getAgentsSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.currentAgents = action.payload;
    },
    getAgentsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  getAgentsStart,
  getAgentsSuccess,
  getAgentsFailure,
} = AgentSlice.actions;
export default AgentSlice.reducer;
