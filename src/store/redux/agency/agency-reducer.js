//import axios from 'axios';
import * as actionTypes from './agency-actionTypes';
const log = require("loglevel").getLogger("AgencyReducer");
log.setLevel("debug");

const initialState = JSON.stringify({
	agecy: null, // user holds _id, agent and token
	lastPath: null
});

function agencyReducer(state = JSON.parse(initialState), action) {
	switch (action.type) {
		case actionTypes.AGENCY_LOGGED_IN: {


			return {
				...state,
				agency: action.data
			}
		}
		case actionTypes.AGENCY_LOGGED_OUT: {
			return {
				...state,
				agency: null
			}
		}
		default:
			return state;
	}
}

export default agencyReducer;
