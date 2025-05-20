import * as actionTypes from './agent-actionTypes';
import * as agentService from './agent-service'

const log = require("loglevel").getLogger("agentActions");
log.setLevel("debug");

export const agentSignIn = (agent, chkRememberMe, callback) => {
	return async (dispatch) => {
		log.debug("agentActions -> signIn -> Enter");

		const result = await agentService.agentSignIn(agent);
		if(result == null) {
			callback('failed');
		}
		else {
			//console.log("result=",result);
			localStorage.setItem("jToken", result.token);
			//props.setToken(result.data.token);
			localStorage.setItem("id", result.agent._id);
			localStorage.setItem("agent_id", result.agent.agent_id);
			localStorage.setItem("agency_id", result.agent.agency_id);
			//props.setagent(result.data.agent);
				localStorage.setItem("agent", JSON.stringify(result.agent));


			await dispatch ({
				type: actionTypes.AGENT_LOGGED_IN,
				data: agent
			});

			callback('agent logged it');
		}

			await dispatch ({
				type: actionTypes.AGENT_LOGGED_IN,
				data: agent
			});

			callback('agent logged it');
		}
	};

export const signUp = (agent, callback) => {
	return async (dispatch) => {
		log.debug("agentActions -> signUp -> Enter");

		const result = await agentService.signUp(agent);
		if(result == null) {
			callback('failed');
		}
		else {
			callback('ok');
		}
	}
};

export const setLoggedInAgent = agent => {
	console.log("agent loggend in!");
	return {
		type: actionTypes.AGENT_LOGGED_IN,
		data: agent
	}

};

export const forgotPassword = email => {
	return async (dispatch) => {
		log.debug("agentActions -> forgotPassword -> Enter");
		await agentService.forgotPassword(email);
	}
};


export const agentSignOut = () => {
	return async (dispatch) => {
		log.debug("agentActions -> signOut -> Enter");

		localStorage.removeItem("agent");

		await dispatch ({
			type: actionTypes.AGENT_LOGGED_OUT
		});
	}
};
