import axios from 'axios';
import constants from "../../../Util/constants";
import { getStorageValue } from "../../../Util/general";
import moment from "moment";
//import default_res from '../../../Util/guesty_listing_defualt_res.json';
const log = require("loglevel").getLogger("PropertyService");
log.setLevel("debug");


export const loadProperty = async (propertyId) => {
	log.debug("PropertyService -> loadProperty -> Enter");

	const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token2}`
		}
	});

	const filter_ids = '[{"field":"ids", "operator":"$in", "value": ["' + propertyId + '"]}]';

	const params = {
		filters: filter_ids,
		limit: 1,
		skip: 0,

	};
	// q: localStorage.getItem("destination"),
	//available:available,
	const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
	const shubSearch = constants.SHUB_URL+'/local/listings?';
	return reqInstance.get(`${shubSearch}${queryString}`)
		.then(async response => {
			const res = response.data;
			console.log("PropertyService -> loadProperties ->local Shub response: --------", res);
			//console.log("res?.listings[0]?.listing response:",res?.listings[0]);
			//console.log("res count:", res.count, res);
			console.log('loaded prop:', res?.listings[0])
			return res;
		})
		.catch(response => {
			log.debug('PropertyService -> loadProperty -> error: ');
			log.debug(response);
			return response;
		})
	// localStorage.setItem('count", default_res.count);
	// return default_res;
};


export const loadProperties = async (pageNumber) => {
	//log.debug("PropertyService -> loadProperties -> Enter");
console.log('loadProperties has been called');
	const tokenShub = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${tokenShub}`
		}
	});
	/* filters on search 
		1. basic: 		destination, sortBy ( q, sort)
		  2. main page: 	available ,collections ,  onDemand  (avail, tags, tags)
		3. advanced: 	priceRange, propertyType, amenities, musthaves (tags, f , f, f)
	
		basic:
	
	*/
	const destination = getStorageValue("destination")
	const sortBy = localStorage.getItem("sortBy") ? localStorage.getItem("sortBy") : '';
	const adults = parseInt(localStorage.getItem("adults") ? localStorage.getItem("adults") : 1);
	const children = parseInt(localStorage.getItem("children") ? localStorage.getItem("children") : 0);
	const guests = parseInt(adults + children) ? parseInt(adults + children) : 1;
	const bedrooms = parseInt(localStorage.getItem("bedrooms") ? localStorage.getItem("bedrooms") : 1);
	const bathrooms = parseInt(localStorage.getItem("bathrooms") ? localStorage.getItem("bathrooms") : 1);

	// --------

	//main page: available, onDemand, collections (onDemand + collections are by TAGS!!)
	const dateFrom = localStorage.getItem("dateFrom") ? moment(localStorage.getItem("dateFrom")).format("YYYY-MM-DD") : 0;
	const dateTo = localStorage.getItem("dateTo") ? moment(localStorage.getItem("dateTo")).format("YYYY-MM-DD") : 0;
	const available = (dateFrom != "null" && dateTo != "null" && dateTo && dateFrom) ?
		'{' + '"checkIn":"' + dateFrom + '","checkOut":"' + dateTo + '","minOccupancy":' + guests + '}' : '';
	// tags:
	const collections = localStorage.getItem("collections") ? JSON.parse(localStorage.getItem("collections")) : null;
	const onDemand = localStorage.getItem("onDemand") ? localStorage.getItem("onDemand") == 'true' : false;
	const onPrice = localStorage.getItem("onPrice") ? localStorage.getItem("onPrice") == 'true' : false;
	// advanced: propertyType, amenities + musthaves

	const priceRange = localStorage.getItem("searchedPriceRange") ? localStorage.getItem("searchedPriceRange") : null;
	const propertyType = localStorage.getItem("searchedTypes") ? localStorage.getItem("searchedTypes") : null;
	const mustHaves = localStorage.getItem("selectedMusthave") ? JSON.parse(localStorage.getItem("selectedMusthave")) : '';
	const amenities = localStorage.getItem("selectedAmenities") ? JSON.parse(localStorage.getItem("selectedAmenities")) : '';
	const geo = localStorage.getItem("geo") ? localStorage.getItem("geo")  : '';

	const amenitiesNames = amenities.length > 0 ? amenities.map((name) => {
		return { value: name };
	}) : null;
	//console.log("collections:",collections)
	// creating the filters and tags:
	let filters = []
	let tags = []
	let NOTtags = []

	// filters.push('{"field":"channel", "operator":"$in", "value": ["VT"]}') // filtering only VT channel

	if (collections) { tags = collections }
	if (onDemand) { tags.push('onDemand') }
	if (onPrice) { NOTtags.push('onDemand') }
	if (priceRange) { tags.push(priceRange) }

	console.log("guests:",guests)
	if (guests>=2) filters.push('{"field":"accommodates", "operator":"$gte", "value": [' + guests + ']}') // push bedrooms to filters
	if (bedrooms) {
		filters.push('{"field":"bedrooms", "operator":"$gte", "value": [' + bedrooms + ']}') // push bedrooms to filters
	} // adding bedrooms
	if (bathrooms) {
		filters.push('{"field":"bathrooms", "operator":"$gte", "value": [' + bathrooms + ']}') // push bathrooms to filters
	} // adding bathrooms

	if (tags.length > 0) {
		var tagsStr = tags.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		//console.log("tags for search:", tagsStr)
		filters.push('{"field":"tags", "operator":"$in", "value": ["' + tagsStr + '"]}') // push tags to filters
	}
	if (NOTtags.length > 0) {
		var NOTtagsStr = NOTtags.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		console.log("NOT tags for search:", tagsStr)
		filters.push('{"field":"!tags", "operator":"$nin", "value": ["' + NOTtagsStr + '"]}') // push tags to filters
	}

	if (propertyType) {
		filters.push('{"field":"propertyType", "operator":"$in", "value": ["' + propertyType + '"]}');
		console.log("propertyType:", propertyType)
	}

	let amenitiesArr = []
	let mustHavesArr = []

	if (amenities.length > 0) {
		amenitiesArr = amenities.map((item) => item.value) // creates "pool","garden","musthave2"...
		// filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenitiesMustHavesStr + '"]}');
		//console.log("amenities:",amenitiesArr)
	}

	if (mustHaves.length > 0) {
		mustHavesArr = mustHaves.map((item) => item.value) // creates "pool","garden","musthave2"...
		// filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenitiesMustHavesStr + '"]}');
		//console.log("musthaves:",mustHavesArr)
	}

	const amenMust = amenitiesArr.concat(mustHavesArr) // in shub amenities and musthave are the same!

	if (amenMust.length > 0) {
		var amenStr = amenMust.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		//console.log("amen:",amenStr)
		filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenStr + '"]}') // push amenities to filters
	}

	var filterS = filters.map((item) => item).join(",")
	const searchFilters = '[' + filterS + ']';

	const LIMIT = 12;

	const params = {
				//noCals: 'yes', // this will load without the calendars and save time and data
		limit: 12,
		skip: pageNumber * 12,
		// status: 'Approved'
		//notEX: put to get results without the external props from BP/RU
	};
	if (destination && destination !== '') { params.q = destination } // adding destination to query
	if (geo && geo !== '') { params.geo = geo } // adding destination to query
	if (filters.length > 0) { params.filters = searchFilters } // adding filters
	if (sortBy !== '') { params.sortBy = sortBy } // adding sort by
	if ((dateFrom && dateTo)) { params.available = available } // adding available
	if (geo) {
		delete params.q
		params.geo=geo
	}
	console.log("search params:", params)

	const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	const shubSearch = constants.SHUB_URL + '/local/listings-search?';

	return reqInstance.get(`${shubSearch}${queryString}`)
		.then(async response => {
			const res = response.data;

			if (dateFrom && dateTo) {
				// Calculate the length of the stay
				const stayDuration = moment(dateTo).diff(moment(dateFrom), 'days');

				// Filter out listings that do not meet the stay duration requirements
				res.listings = res.listings.filter(listing => {
					const minNights = listing.listing.terms.minNights;
					const maxNights = listing.listing.terms.maxNights;

					return stayDuration >= minNights && stayDuration <= maxNights;
				});
			}
			// Sort and further process the listings
			res.listings.sort((a, b) => {
				const aOnDemand = a.listing.tags && a.listing.tags.includes("onDemand");
				const bOnDemand = b.listing.tags && b.listing.tags.includes("onDemand");

				if (aOnDemand && !bOnDemand) {
					return 1;
				} else if (!aOnDemand && bOnDemand) {
					return -1;
				} else {
					return 0;
				}
			});

			if (res.count > 0) {
				localStorage.setItem("count", res?.count ? res?.count : 0);
				localStorage.setItem("wishlist", false);
				localStorage.setItem("withondemandpropertycount", res?.onDemandCount ? res?.onDemandCount : 0);
				localStorage.setItem("allpropertycount", res?.allCount ? res?.allCount : 0);
				// if(onDemand) {
				// 	localStorage.setItem("withondemandpropertycount", res?.onDemandCount ? res?.onDemandCount : 0);
				// } else {
				// 	localStorage.setItem("allpropertycount", res?.count ? res?.count : 0);
				// }
			} else {
				localStorage.setItem("wishlist", true);
			}

			return res;
		})
		.catch(response => {
			console.error("PropertyService -> loadProperties -> error: ", response);
			return response;
		});
};

export const toggleOnDemandandloadProperties = async (pageNumber, tmpondemand) => {
	//log.debug("PropertyService -> loadProperties -> Enter");

	const tokenShub = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${tokenShub}`
		}
	});
	/* filters on search 
		1. basic: 		destination, sortBy ( q, sort)
		  2. main page: 	available ,collections ,  onDemand  (avail, tags, tags)
		3. advanced: 	priceRange, propertyType, amenities, musthaves (tags, f , f, f)
	
		basic:
	
	*/
	const destination = getStorageValue("destination")
	const sortBy = localStorage.getItem("sortBy") ? localStorage.getItem("sortBy") : '';
	const adults = parseInt(localStorage.getItem("adults") ? localStorage.getItem("adults") : 0);
	const children = parseInt(localStorage.getItem("children") ? localStorage.getItem("children") : 0);
	const guests = parseInt(adults + children) ? parseInt(adults + children) : 1;
	const bedrooms = parseInt(localStorage.getItem("bedrooms") ? localStorage.getItem("bedrooms") : 0);
	const bathrooms = parseInt(localStorage.getItem("bathrooms") ? localStorage.getItem("bathrooms") : 0);

	// --------

	//main page: available, onDemand, collections (onDemand + collections are by TAGS!!)
	const dateFrom = localStorage.getItem("dateFrom") ? moment(localStorage.getItem("dateFrom")).format("YYYY-MM-DD") : 0;
	const dateTo = localStorage.getItem("dateTo") ? moment(localStorage.getItem("dateTo")).format("YYYY-MM-DD") : 0;
	const available = (dateFrom != "null" && dateTo != "null" && dateTo && dateFrom) ?
		'{' + '"checkIn":"' + dateFrom + '","checkOut":"' + dateTo + '","minOccupancy":' + guests + '}' : '';
	// tags:
	const collections = localStorage.getItem("collections") ? JSON.parse(localStorage.getItem("collections")) : null;
	const onDemand = tmpondemand
	const onPrice = localStorage.getItem("onPrice") ? localStorage.getItem("onPrice") == 'true' : false;
	// advanced: propertyType, amenities + musthaves

	const priceRange = localStorage.getItem("searchedPriceRange") ? localStorage.getItem("searchedPriceRange") : null;
	const propertyType = localStorage.getItem("searchedTypes") ? localStorage.getItem("searchedTypes") : null;
	const mustHaves = localStorage.getItem("selectedMusthave") ? JSON.parse(localStorage.getItem("selectedMusthave")) : '';
	const amenities = localStorage.getItem("selectedAmenities") ? JSON.parse(localStorage.getItem("selectedAmenities")) : '';
	const geo = localStorage.getItem("geo") ? localStorage.getItem("geo")  : '';

	const amenitiesNames = amenities.length > 0 ? amenities.map((name) => {
		return { value: name };
	}) : null;
	//console.log("collections:",collections)
	// creating the filters and tags:
	let filters = []
	let tags = []
	let NOTtags = []

	// filters.push('{"field":"channel", "operator":"$in", "value": ["VT"]}') // filtering only VT channel

	if (collections) { tags = collections }
	if (onDemand) { tags.push('onDemand') }
	if (onPrice) { NOTtags.push('onDemand') }
	if (priceRange) { tags.push(priceRange) }

	console.log("guests:",guests)
	if (guests>2) filters.push('{"field":"accommodates", "operator":"$gte", "value": [' + guests + ']}') // push bedrooms to filters
	if (bedrooms) {
		filters.push('{"field":"bedrooms", "operator":"$gte", "value": [' + bedrooms + ']}') // push bedrooms to filters
	} // adding bedrooms
	if (bathrooms) {
		filters.push('{"field":"bathrooms", "operator":"$gte", "value": [' + bathrooms + ']}') // push bathrooms to filters
	} // adding bathrooms

	if (tags.length > 0) {
		var tagsStr = tags.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		//console.log("tags for search:", tagsStr)
		filters.push('{"field":"tags", "operator":"$in", "value": ["' + tagsStr + '"]}') // push tags to filters
	}
	if (NOTtags.length > 0) {
		var NOTtagsStr = NOTtags.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		console.log("NOT tags for search:", tagsStr)
		filters.push('{"field":"!tags", "operator":"$nin", "value": ["' + NOTtagsStr + '"]}') // push tags to filters
	}

	if (propertyType) {
		filters.push('{"field":"propertyType", "operator":"$in", "value": ["' + propertyType + '"]}');
		console.log("propertyType:", propertyType)
	}

	let amenitiesArr = []
	let mustHavesArr = []

	if (amenities.length > 0) {
		amenitiesArr = amenities.map((item) => item.value) // creates "pool","garden","musthave2"...
		// filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenitiesMustHavesStr + '"]}');
		//console.log("amenities:",amenitiesArr)
	}

	if (mustHaves.length > 0) {
		mustHavesArr = mustHaves.map((item) => item.value) // creates "pool","garden","musthave2"...
		// filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenitiesMustHavesStr + '"]}');
		//console.log("musthaves:",mustHavesArr)
	}

	const amenMust = amenitiesArr.concat(mustHavesArr) // in shub amenities and musthave are the same!

	if (amenMust.length > 0) {
		var amenStr = amenMust.map((item) => item).join('","') // creates "tag1","tag2","tag3"...
		//console.log("amen:",amenStr)
		filters.push('{"field":"amenities", "operator":"$in", "value": ["' + amenStr + '"]}') // push amenities to filters
	}

	var filterS = filters.map((item) => item).join(",")
	const searchFilters = '[' + filterS + ']';

	const params = {
				//noCals: 'yes', // this will load without the calendars and save time and data
		limit: 12,
		skip: pageNumber * 12,
		//notEX: put to get results without the external props from BP/RU
	};
	if (destination && destination !== '') { params.q = destination } // adding destination to query
	if (geo && geo !== '') { params.geo = geo } // adding destination to query
	if (filters.length > 0) { params.filters = searchFilters } // adding filters
	if (sortBy !== '') { params.sortBy = sortBy } // adding sort by
	if ((dateFrom && dateTo)) { params.available = available } // adding available
	if (geo) {
		delete params.q
		params.geo=geo
	}
	console.log("search params:", params)

	const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	const shubSearch = constants.SHUB_URL + '/local/listings?';

	return reqInstance.get(`${shubSearch}${queryString}`)
		.then(async response => {
			const res = response.data;
			console.log(res)
			if (res.count) {
				if(onDemand) {
					localStorage.setItem("withondemandpropertycount", res?.count ? res?.count : 0);
				} else {
					localStorage.setItem("allpropertycount", res?.count ? res?.count : 0);
				}
			}
			return res;
		})
		.catch(response => {
			console.error("PropertyService -> loadPropertiestoggleondemand -> error: ", response);
			return response;
		});
};

export const loadreservationreport = async (data) => {
	const userToken = localStorage.getItem('jToken');
	const userRequest = axios.create({
		baseURL: `${constants.BASE_URL}/reservation/get-reservation-reports?agent_id=${data.agent_id}&agency_id=${data.agency_id}`,
		headers: {
			token: `Bearer ${userToken}`,
		},
	});

	return await userRequest.get()
}

export const loadFavorites = async (pageNumber) => {
	log.debug("PropertyService -> loadFavorites -> Enter-**-*-*-*--*-*-*");
	const TOKEN = localStorage.getItem("jToken");

	const userRequest = axios.create({
		baseURL: constants.BASE_URL,
		headers: {
			token: `Bearer ${TOKEN}`,
		},
	});

	const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const readFavorites = async () => {
		const agentID = localStorage.getItem("agent_id");
		return userRequest.get(`/favorite/get-favorites?agent_id=${agentID}`)
			.then(async response => {
				const favoriteIdsArray = response?.data[0]?.favorites?.map(item => item.favorite);
				localStorage.setItem('favoriteIds', JSON.stringify(favoriteIdsArray));
				const res = response.data[0];
				//console.log("PropertyService -> loadFavorties -> response: ", res);
				if (res.totalFavorites) {
					//console.log("count favorites:", res.totalFavorites);
					{ localStorage.setItem("totalFavorites", res.totalFavorites); }
				}

				const favorites = res.favorites;
				const favoritesCSV = Object.keys(favorites).map(key => favorites[key].favorite).join('", "');
				console.log(favoritesCSV, "------------------=favorites");
				const filter_ids = '[{"field":"ids", "operator":"$in", "value": ["' + favoritesCSV + '"]}]';
				const params = {
					filters: filter_ids,
					limit: 12,
					skip: pageNumber * 12,
				};

				const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
				const guestySearch = constants.SHUB_URL+'/services/guesty/openapi/listings?';
				const shubSearch = constants.SHUB_URL + '/local/listings?';
				return reqInstance.get(`${shubSearch}${queryString}`)
					.then(async response => {
						const res = response.data;
						// console.log("PropertyService -> loadProperties -> response: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----", res);
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
			})
			.catch(response => {
				log.debug("PropertyService -> loadFavorites -> error: ");
				log.debug(response);
				return response;
			})

	}

	let favorites = readFavorites(); // reads the favorites of the agent from backend
	return favorites;

	// localStorage.setItem("count", default_res.count);
	// return default_res;
};

export const getQoute = async (propertyId, body) => {
	// log.debug("PropertyService -> loadFavorites -> Enter");

	if (!body || !propertyId) { return "no PID or body" }

	else {
		console.log("qoute=", propertyId, body);
		const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

		const reqInstance = axios.create({
			headers: {
				Authorization: `Bearer ${token2}`
			}
		});
		const qouteURL = constants.SHUB_URL+'/qoute/'+propertyId;
		return reqInstance.get(`${qouteURL}`, body)
			.then(async response => {
				const res = response.data;
				console.log("PropertyService -> getQoute -> response: ", res);
				if (res.qouteResult) {
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

export const loadPropertiesIds = async (propIds) => {
	log.debug("PropertyService -> loadFavorites -> Enter-**-*-*-*--*-*-*");
	const TOKEN = localStorage.getItem("jToken");

	const userRequest = axios.create({
		baseURL: constants.BASE_URL,
		headers: {
			token: `Bearer ${TOKEN}`,
		},
	});

	const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

	const reqInstance = axios.create({
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const readIds = async (ids) => {

		const propertiesCSV = ids.join('", "');
		console.log(propertiesCSV, "=ids");
		const filter_ids = '[{"field":"ids", "operator":"$in", "value": ["' + propertiesCSV + '"]}]';
		const params = {
			filters: filter_ids,
			limit: 50,
			//noCals: 'yes'
		};

		const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
		const shubSearch = constants.SHUB_URL + '/local/listings?';
		return reqInstance.get(`${shubSearch}${queryString}`)
			.then(async response => {
				const res = response.data;
				// console.log("PropertyService -> loadProperties -> response: <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----", res);
				if (res.count) {
					//console.log("count:", res.count);
					{ localStorage.setItem("totalSelectedPropertiesItem", res.count); }
				}
				return res;
			})
			.catch(response => {
				log.debug("PropertyService -> loadIds -> error: ");
				log.debug(response);
				return response;
			})
	}
	let properties = await readIds(propIds); // reads the favorites of the agent from backend
	console.log('loaded props:', properties.listings)
	localStorage.setItem('selectedPropertiesItem', JSON.stringify(properties.listings));
	return properties.listings;

	// localStorage.setItem("count", default_res.count);
	// return default_res;
};

export const updateXdata = async (guestyId, data) => {
	log.debug("PropertyService -> updateXdata -> Enter");

	if (!guestyId) { return "no guestyId" }

	else {
		const token2 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';

		const reqInstance = axios.create({
			headers: {
				Authorization: `Bearer ${token2}`
			}
		});

		const shubXdata = constants.SHUB_URL+'/local/xdata/';
		console.log("API FAVORITES REQUEST=", `${shubXdata}"${guestyId}"`);
		return reqInstance.post(`${shubXdata}"${guestyId}"`)
			.then(async response => {
				const res = response.data;
				console.log("PropertyService -> xdataUpdate -> response: ", res);
				return res;
			})
			.catch(response => {
				log.debug("PropertyService -> xdataUpdate -> error: ");
				log.debug(response);
				return response;
			})
	}

};