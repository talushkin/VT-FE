import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/User/reducer";
import AgentReducer from "./reducers/AgentReducer";
import PropertyReducer from './redux/Property/reducer';

export default configureStore({
	reducer: {
		user: userReducer,
		Agent: AgentReducer,
		property: PropertyReducer
	},
});
