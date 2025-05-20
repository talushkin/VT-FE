import axios from 'axios';
import constants from "../../../Util/constants";
import { toast } from 'react-toastify';

const log = require("loglevel").getLogger("UserService");
log.setLevel("debug");

axios.interceptors.request.use(request => {
	// log.info('Starting Request', request.url);
	return request;
});

axios.interceptors.response.use(response => {
	// //console.log('Response:', response)
	return response;
});

export const sendtwoFA = async user => {
// 'http://localhost:8080'${constants.BASE_URL}
	log.debug("UserService -> send2FA -> Enter");
	return axios.post(`${constants.BASE_URL}/agent/twofa`, user)
		.then(async response => {
			console.log(response.data)
			const res = response.data
			if(res.status) {
				toast.success(res.message, {
					position: 'top-right',
					toastClassName: 'custom-toast',
				});
				return res;
			} else {
				toast.success(res.message, {
					position: 'top-right',
					toastClassName: 'custom-toast',
				});
				setTimeout(() => {
					window.location.href = '/login';
		
				}, 5000)
				return null;
			}
		})
}
export const signIn = async user => {
	log.debug("UserService -> signIn -> Enter");
	return axios.post(`${constants.BASE_URL}/agent/login`, user)
		.then(async response => {
			const res = response.data;
			// log.debug("UserService -> signIn -> response: " + res);
			//localStorage.setItem("res123", JSON.stringify(res));
		
			if (res.agent) {
				toast.success(res.message, {
					position: 'top-right',
					toastClassName: 'custom-toast',
				});
				return res;
			} else {
				toast.success(res.message, {
					position: 'top-right',
					toastClassName: 'custom-toast',
				});
				setTimeout(() => {
					window.location.href = '/login';
		
				}, 5000)
			
				
				return null;
			}


		})
		.catch(response => {
			// log.debug("userService -> signIn -> error: ");
			log.debug(response);

			toast.error(response.response.data.message, {
				position: 'top-right',
				toastClassName: 'custom-toast',
			});
			return null;
		});
};
export const signUp = async user => {
	log.debug("UserService -> signUp -> Enter");

	return axios.post(`${constants.BASE_URL}/agent/signup`, user)
		.then(async response => {
			const res = response.data;
			log.debug("UserService -> signUp -> response: " + res.data?.user);
			return res;
		})
		.catch(responseData => {
			log.debug("userService -> signUp -> error1001: ",responseData);
			toast.error(responseData?.response?.data?.message, {
				position: 'top-right',
				toastClassName: 'custom-toast',
			});
			log.debug(responseData);
			return null;
		})
};

export const forgotPassword = async email => {
 
	return axios.post(`${constants.BASE_URL}/agent/forget-password`, { email })
		.then(async response => {
			const res = response.data;
 		 
 			return res;
		})
		.catch(response => {
			log.debug(response);
			return null;
		})
};

export const signOut = () => {
	try {
	}
	catch (e) { }
};

