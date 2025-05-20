import * as actionTypes from './actionTypes';
import * as propertyService from './service';

const log = require("loglevel").getLogger("PropertyActions");
log.setLevel("debug");

export const updateSearchValues = (data) => {
	return async (dispatch) => {
		await dispatch({
			type: actionTypes.UPDATE_SEARCH_VALUES,
			data
		});
	}
}

export const loadProperty = (propertyId) => {
    return async (dispatch) => {
        // Start loading
		await dispatch({
			type: actionTypes.LOADING_PROPERTIES,
			data: true
		});
		console.log('LOADING_PROPERTY');
            const response = await propertyService.loadProperty(propertyId);

            if (response && response.listings && response.listings.length > 0) {
                const propertyData = response.listings[0];
                localStorage.setItem("property", JSON.stringify(propertyData));
            } else {
                log.error("No property data found in the response.");
            }
     setTimeout(async() => {
		await dispatch({
			type: actionTypes.PROPERTIES_LOADED,
			data: response
		});

	 }, 2000)
    };
};

export const updateSearchParams = (data) => {
	return async (dispatch) => {
		await dispatch({
			type: actionTypes.UPDATE_SEARCH_PARAMS,
			data
		});
	}
}

export const toggleMapInSearch = (status) => {
	return async (dispatch) => {
		await dispatch({
			type: actionTypes.UPDATE_SHOWINMAPSEARCH,
			data: !status
		});
	}
}

export const loadProperties = (pageNumber) => {

	return async (dispatch) => {
// const startTime= performance.now(); //By Jaison.

		log.debug("PropertyActions -> loadProperties -> Enter");

		await dispatch({
			type: actionTypes.LOADING_PROPERTIES,
			data: true
		});

		
		const properties = await propertyService.loadProperties(pageNumber);

		// setTimeout(async() => {
			await dispatch({
				type: actionTypes.PROPERTIES_LOADED,
				data: properties
			});
		//  }, 4000);


//By Jaison.
// const LOADING_TIME = (performance.now() - startTime) / 1000;
// console.log(`LOADING TIME: ${LOADING_TIME.toFixed(3)} seconds`);		 
	}
	
};

export const toggleOnDemandandloadProperties = (pageNumber) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> loadProperties toggle onDemand -> Enter");

		const onDemand = localStorage.getItem("onDemand") ? localStorage.getItem("onDemand") == 'true' : false;
		const tmpOnDemand = !onDemand;
		const properties = await propertyService.toggleOnDemandandloadProperties(pageNumber, tmpOnDemand);
		console.log(properties)
		
	}
};

export const getreservationreport = (data) => {
	// console.log(data) 
	return async (dispatch) => {
		await dispatch({
			type: actionTypes.LOADING_RESERVATION_REPORTS,
			data: true
		});

		const reports = await propertyService.loadreservationreport(data)
		// console.log(reports)
		if(reports?.data?.status) {
			await dispatch({
				type: actionTypes.RESERVATION_REPORTS_LOADED,
				data: reports?.data?.report[0]
			});
		}
		
	}
}

export const loadFavorites = (pageNumber) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> loadFavorites -> Enter");

		await dispatch({
			type: actionTypes.LOADING_FAVORITES,
			data: true
		});

		const favorites = await propertyService.loadFavorites(pageNumber);

		await dispatch({
			type: actionTypes.FAVORITES_LOADED,
			data: favorites
		});
	}
};

export const getQoute = (propertyId, body) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> getQoute -> Enter");

		await dispatch({
			type: actionTypes.GET_QOUTE,
			data: true
		});

		const qoute = await propertyService.getQoute(propertyId, body);

		await dispatch({
			type: actionTypes.QOUTE_LOADED,
			data: qoute
		});
	}
};

export const loadIds = (propIds) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> loadIds -> Enter");

		await dispatch({
			type: actionTypes.LOADING_IDS,
			data: true
		});

		const properties = await propertyService.loadPropertiesIds(propIds);

		await dispatch({
			type: actionTypes.IDS_LOADED,
			data: properties
		});
	}
};

export const toggleProperty = property => {
	return {
		type: actionTypes.TOGGLE_SELECTED_PROPERTY,
		data: property.listing
	};
};

export const clearProperties = () => {
	return {
		type: actionTypes.CLEAR_PROPERTIES
	};
};

export const updateValidSearchDestination = (status) => {
	return {
		type: actionTypes.VALID_SEARCH_DESTINATION_CHECK,
		data: status
	};
}

export const flagWishlistModel = (status) => {
	return {
		type: actionTypes.FLAG_WISHLIST_MODEL,
		data: status
	};
}
