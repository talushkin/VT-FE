import axios from 'axios';
import constants from "../../../Util/constants";

const log = require("loglevel").getLogger("agentService");
log.setLevel("debug");

axios.interceptors.request.use(request => {
	// log.info('Starting Request', request.url);
	return request;
});

axios.interceptors.response.use(response => {
	// console.log('Response:', response)
	return response;
});

export const signIn = async agent => {
	log.debug("agentService -> signIn -> Enter");

	return axios.post(`${constants.BASE_URL}/agent/login`, agent)
		.then(async response => {
			const res = response.data;
			log.debug("agentService -> signIn -> response: " + res);
			return res;

		})
		.catch(response => {
			log.debug("agentService -> signIn -> error: ");
			log.debug(response);
			return null;
		})
};

export const signUp = async agent => {
	log.debug("agentService -> signUp -> Enter");

	return axios.post(`${constants.BASE_URL}/agent/signup`, agent)
		.then(async response => {
			const res = response.data;
			log.debug("agentService -> signUp -> response: " + res.data?.user);
			return res;
		})
		.catch(response => {
			log.debug("agentService -> signUp -> error: ");
			log.debug(response);
			return null;
		})
};

export const forgotPassword = async email => {
	log.debug("agentService -> forgotPassword -> Enter");

	return axios.post(`${constants.BASE_URL}/agent/forget-password`, {email})
		.then(async response => {
			const res = response.data;
			log.debug("agentService -> forgotPassword -> response: " + res.data?.user);
			return res;
		})
		.catch(response => {
			log.debug("agentService -> forgotPassword -> error: ");
			log.debug(response);
			return null;
		})
};

export const signOut = () => {
	try {
	}
	catch(e) {}
};

