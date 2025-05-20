import * as actionTypes from './property-actionTypes';

const log = require("loglevel").getLogger("propertyReducer");
log.setLevel("debug");

const initialState = JSON.stringify({
	reservations: [],
	properties: null,
	selectedProperties: [],
	wishListItems: [],
	favorites: null,
	isLoading: false
});

const propertyReducer = (state = JSON.parse(initialState), action) => {
	switch (action.type) {
		case actionTypes.LOADING_PROPERTIES: {
			return {
				...state,
				isLoading: true
			}
		}
		case actionTypes.PROPERTIES_LOADED: {
			return {
				...state,
				properties: action.data,
				isLoading: false
			}
		}
		case actionTypes.LOADING_PROPERTY: {
			return {
				...state,
				isLoading: true
			}
		}
		case actionTypes.PROPERTY_LOADED: {
			return {
				...state,
				properties: action.data,
				isLoading: false
			}
		}
		case actionTypes.LOADING_FAVORITES: {
			return {
				...state,
				isLoading: true
			}
		}
		case actionTypes.FAVORITES_LOADED: {
			return {
				...state,
				favorites: action.data,
				isLoading: false
			}
		}
		case actionTypes.GET_QOUTE: {
			return {
				...state,
				isLoading: true
			}
		}
		case actionTypes.QOUTE_LOADED: {
			return {
				...state,
				favorites: action.data,
				isLoading: false
			}
		}
		case actionTypes.CLEAR_PROPERTIES: {
			return {
				...state,
				properties: null
			}
		}
		case actionTypes.TOGGLE_SELECTED_PROPERTY: {
			const property = action.data;
			let {selectedProperties} = state;

			if(selectedProperties.findIndex(p => p._id === property._id) > -1) {
				selectedProperties = selectedProperties.filter(p => p._id !== property._id);
			}
			else if(selectedProperties.length < 5) {
				selectedProperties = [...selectedProperties, property];

			}

			return {
				...state,
				selectedProperties
			}
		}
		default:
			return state;
	}
};

export default propertyReducer;
