import * as actionTypes from './agency-actionTypes';
import * as agencyService from './agency-service'

const log = require("loglevel").getLogger("agencyActions");
log.setLevel("debug");

export const readAgency = (agencyId, chkRememberMe, callback) => {
	return async (dispatch) => {
		log.debug("agencyActions -> readAgency -> Enter");

		const result = await agencyService.readAgency(agencyId);
		if(result == null) {
			callback('failed');
		}
		else {

			localStorage.setItem("agency_id", result.agency.agency_id);
			localStorage.setItem("agency", JSON.stringify(result.agency));


			await dispatch ({
				type: actionTypes.AGENCY_LOGGED_IN,
				data: agency
			});
			callback('ok');
		}
	}
};

export const updateAgency = (agency, callback) => {
	return async (dispatch) => {
		log.debug("agencyActions -> updateAgency -> Enter");

		const result = await agencyService.updateAgency(agency);
		if(result == null) {
			callback('failed');
		}
		else {
			callback('ok');
		}
	}
};

export const setLoggedInAgency = agency => {
	return {
		type: actionTypes.AGENCY_LOGGED_IN,
		data: agency
	}
};


export const signOut = () => {
	return async (dispatch) => {
		log.debug("agencyActions -> signOut -> Enter");

		localStorage.removeItem("agency");

		await dispatch ({
			type: actionTypes.AGENCY_LOGGED_OUT
		});
	}
};
