import axios from 'axios';
import * as actionTypes from './actionTypes';
const log = require("loglevel").getLogger("userReducer");
log.setLevel("debug");

const initialState = JSON.stringify({
	agent: null, // user holds _id, agent and token
	lastPath: null
});

function agentReducer(state = JSON.parse(initialState), action) {
	switch (action.type) {
		case actionTypes.AGENT_LOGGED_IN: {

			axios.defaults.headers.common['Authorization'] = `Bearer ${action.data.token}`;

			return {
				...state,
				agent: action.data
			}
		}
		case actionTypes.AGENT_LOGGED_OUT: {
			return {
				...state,
				agent: null
			}
		}
		default:
			return state;
	}
}

export default agentReducer;
