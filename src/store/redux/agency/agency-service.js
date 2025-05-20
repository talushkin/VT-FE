import axios from 'axios';
import constants from "../../../Util/constants";
import { toast } from 'react-toastify';

const log = require("loglevel").getLogger("agencyService");
log.setLevel("debug");

axios.interceptors.request.use(request => {
 	return request;
});

axios.interceptors.response.use(response => {
	console.log('Response:', response)
	return response;
});

export const readAgency = async id => {
	log.debug("agencyService -> read -> Enter");

	return axios.get(`${constants.BASE_URL}/travelAgency/get-travel-agencies?agency_id=${id}`)
		.then(async response => {
			const res = response.data;
			log.debug("agencyService -> signIn -> response: " + res);
			return res;

		})
		.catch(response => {
			log.debug("agencyService -> signIn -> error: ");
			log.debug(response);
			return null;
		})
};

export const updateAgency = async agency => {
	log.debug("agencyService -> agency -> update");

	return axios.post(`${constants.BASE_URL}/travelAgency/update-travel-agencies`, agency)
		.then(async response => {
			const res = response.data;
			log.debug("agencyService -> update -> response: " + res.data?.user);
			return res;
		})
		.catch(response => {
			log.debug("agencyService -> update -> error: ");
			log.debug(response);
			return null;
		})
};

export const updateAgencyLogo = async agency => {
	log.debug("agencyService -> agency -> updateLogo");

	return axios.post(`${constants.BASE_URL}/travelAgency/update-profile-picture`, agency)
		.then(async response => {
			const res = response.data;
			log.debug("agencyService -> updateLogo -> response: " + res.data?.user);
			return res;
		})
		.catch(response => {
			log.debug("agencyService -> updateLogo -> error: ");
			log.debug(response);
			return null;
		})
};

export const signOut = () => {
	try {
	}
	catch(e) {}
};

