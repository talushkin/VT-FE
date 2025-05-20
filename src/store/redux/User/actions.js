import * as actionTypes from './actionTypes';
import * as userService from './service'

const log = require("loglevel").getLogger("UserActions");
log.setLevel("debug");
export const sendtwoFAcode = (user, callback) => {
	
	return async (dispatch) => {
		log.debug("UserActions -> send2FA -> Enter");
		const result = await userService.sendtwoFA(user);
		console.log(result)
		if(result == null) {
			callback('failed');
		} else {
			callback('ok');
		}
	}
}
export const signIn = (user, chkRememberMe, callback) => {
	console.log("user details:",user)
	// return;
	return async (dispatch) => {
		log.debug("UserActions -> signIn -> Enter");

		const result = await userService.signIn(user);
		if(result == null) {
			callback('failed');
		}
		else {
			console.log("result=",result);
			localStorage.setItem("jToken", result.token);
			//props.setToken(result.data.token);
			localStorage.setItem("id", result.agent._id);
			localStorage.setItem("agent_id", result.agent.agent_id);
			localStorage.setItem("agency_id", result.agent.agency_id);
			//props.setUser(result.data.agent);
			// add check that agency_id exists on /get-travel-agencies
			if(chkRememberMe) {
				localStorage.setItem("agent", JSON.stringify(result.agent));
			}

			await dispatch ({
				type: actionTypes.USER_LOGGED_IN,
				data: user
			});
			callback('ok');
		}
	}
};

export const signUp = (agent, callback) => {
	return async (dispatch) => {
		log.debug("UserActions -> signUp -> Enter");

		const result = await userService.signUp(agent);
		if(result == null) {
			callback('failed');
		}
		else {
			callback('ok');
		}
	}
};

export const setLoggedInUser = user => {
	return {
		type: actionTypes.USER_LOGGED_IN,
		data: user
	}
};

export const forgotPassword = email => {
	return async (dispatch) => {
		log.debug("UserActions -> forgotPassword -> Enter");
		await userService.forgotPassword(email);
	}
};


export const signOut = () => {
	return async (dispatch) => {
		log.debug("UserActions -> signOut -> Enter");

		localStorage.removeItem("agent");


		await dispatch ({
			type: actionTypes.USER_LOGGED_OUT
		});
	}
};
