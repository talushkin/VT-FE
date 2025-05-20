import * as actionTypes from './property-actionTypes';
import * as propertyService from './property-service';
import { baseURL } from "../../../core";
import axios from "axios";

const log = require("loglevel").getLogger("PropertyActions");
log.setLevel("debug");
const token = localStorage.getItem("jToken");

export const loadProperties = (pageNumber) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> loadProperties -> Enter");

		await dispatch ({
			type: actionTypes.LOADING_PROPERTIES,
			data: true
		});

		const properties = await propertyService.loadProperties(pageNumber);

		await dispatch ({
			type: actionTypes.PROPERTIES_LOADED,
			data: properties
		});
	}
};

export const loadFavorites = (pageNumber) => {
	return async (dispatch) => {
		log.debug("PropertyActions -> loadFavorites -> Enter");

		await dispatch ({
			type: actionTypes.LOADING_FAVORITES,
			data: true
		});
		const userRequest = axios.create({
			baseURL: baseURL,
			headers: {
			  token: `Bearer ${token}`,
			},
		  });
		  
		const readFavorites = async () => {
			const agentID=localStorage.getItem("agent_id")?localStorage.getItem("agent_id"):1;
			console.log("reading agent details:",agentID);
			const favoritesResponse = await userRequest.get(`/favorite/get-favorites?agent_id=${agentID}`);
			console.log("favorites respond >>>>", favoritesResponse.data.favorites[0].favorites);
			
			const favorites = favoritesResponse.data.favorites[0].favorites;
			const queryString = Object.keys(favorites).map(key => favorites[key]).join(',');
			console.log(queryString);
			return favoritesResponse.data.favorites[0].favorites;
		}
		const favorites = readFavorites();
		const queryString = Object.keys(favorites).map(key => favorites[key]).join(',');
		console.log(queryString);
		const properties = await propertyService.loadFavorites(favorites,token);

		await dispatch ({
			type: actionTypes.FAVORITES_LOADED,
			data: favorites
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
