import axios from 'axios';
import * as actionTypes from './actionTypes';
const log = require("loglevel").getLogger("userReducer");
log.setLevel("debug");

const initialState = JSON.stringify({
	user: null, // user holds _id, agent and token
	lastPath: null
});

function userReducer(state = JSON.parse(initialState), action) {
	switch (action.type) {
		case actionTypes.USER_LOGGED_IN: {

			axios.defaults.headers.common['Authorization'] = `Bearer ${action.data.token}`;

			return {
				...state,
				user: action.data
			}
		}
		case actionTypes.USER_LOGGED_OUT: {
			return {
				...state,
				user: null
			}
		}
		default:
			return state;
	}
}

export default userReducer;
