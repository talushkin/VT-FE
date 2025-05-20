import axios from 'axios';
import constants from "../../../Util/constants";
//import default_res from '../../../Util/guesty_listing_defualt_res.json';
const log = require("loglevel").getLogger("PropertyService");
log.setLevel("debug");

export const loadProperties = async (pageNumber) => {
	log.debug("PropertyService -> loadProperties -> Enter");

	const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token2}`
		}
	});
	const tagsS = localStorage.getItem("tags") ? localStorage.getItem("tags") : "";
	//console.log("tags", tagsS);
	const adults=localStorage.getItem("adults")?localStorage.getItem("adults"):0;
	const children=localStorage.getItem("children")?localStorage.getItem("children"):0;
	const Bathrooms=localStorage.getItem("Bathrooms")?localStorage.getItem("Bathrooms"):0;
	const bedrooms=localStorage.getItem("bedrooms")?localStorage.getItem("bedrooms"):0;
	const dateFrom=localStorage.getItem("dateFrom")?localStorage.getItem("dateFrom"):0;
	const dateTo=localStorage.getItem("dateTo")?localStorage.getItem("dateTo"):0;
	const geo=localStorage.getItem("geo")?localStorage.getItem("geo"):null;

	const available = (dateFrom&&dateTo) ?'{' + '/"checkIn/":/"' + dateFrom + '/",/"checkOut/":' +dateTo + '/",/"minOccupancy/":' + adults +children + '}':''
	const params = {
		q: localStorage.getItem("destination"),
		limit: constants.PAGING_PAGE_SIZE,
		skip: pageNumber * constants.PAGING_PAGE_SIZE,
		available
	};
	if (geo) {
		delete params.q
		params.geo=geo
	}
	console.log("params:", params);
	const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
	const guestySearch=constants.SHUB_URL+'/services/guesty/openapi/listings?';
	const shubSearch=constants.SHUB_URL+'/local/listings?';
	return reqInstance.get(`${shubSearch}${queryString}`)
		.then(async response => {
			const res = response.data;
			console.log("PropertyService -> loadProperties -> response: ", res);
			if (res.count) {
				//console.log("count:", res.count);
				{ localStorage.setItem("count", res.count); }
			}
			return res;
		})
		.catch(response => {
			log.debug("PropertyService -> loadProperties -> error: ");
			log.debug(response);
			return response;
		})
	// localStorage.setItem("count", default_res.count);
	// return default_res;
};

export const loadFavorites = async (favorites) => {
	// log.debug("PropertyService -> loadFavorites -> Enter");

	if (!favorites) {return "no favorites"} 

	else {
		console.log("fav=",favorites);
	const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token2}`
		}
	});

	const queryString = Object.keys(favorites).map(key => favorites[key]).join(' ');
	const guestySearch=constants.SHUB_URL+'/services/guesty/openapi/listings?ids=';
	const shubSearch=constants.SHUB_URL+'/local/listings?ids=';
	console.log("API FAVORITES REQUEST=",`${shubSearch}"${queryString}"`);
	return reqInstance.get(`${shubSearch}"${queryString}"`)
		.then(async response => {
			const res = response.data;
			console.log("PropertyService -> loadFavorites -> response: ", res);
			if (res.count) {
				//console.log("count:", res.count);
				{ localStorage.setItem("count", res.count); }
			}
			return res;
		})
		.catch(response => {
			log.debug("PropertyService -> loadFavorites -> error: ");
			log.debug(response);
			return response;
		})
	}

};

export const getQoute = async (propertyId, body) => {
	// log.debug("PropertyService -> loadFavorites -> Enter");

	if (!body || !propertyId) {return "no PID or body"} 

	else {
		console.log("qoute=",propertyId, body);
	const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token2}`
		}
	});
	const qouteURL=`${constants.SHUB_LOCAL}/qoute/${propertyId}`;
	console.log('qoute call:',qouteURL)
	return reqInstance.get(`${qouteURL}`, body)
		.then(async response => {
			const res = response.data;
			console.log("PropertyService -> getQoute -> response: ", res);
			if (res.qouteResult) {
				//console.log("count:", res.count);
				 localStorage.setItem("qoute", JSON.stringify(res.qouteResult)); 
			}
			return res;
		})
		.catch(response => {
			log.debug("PropertyService -> getQoute -> error: ");
			log.debug(response);
			return response;
		})
	}

};


