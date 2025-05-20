import * as actionTypes from './actionTypes';

const log = require("loglevel").getLogger("propertyReducer");
log.setLevel("debug");

const initialState = JSON.stringify({
	reservations: [],
	properties: null,
	selectedProperties: [],
	wishListItems: [],
	favorites: null,
	isLoading: false,
	reservationReports: {},
	validsearchdestination: true,
	flagwishlistmodel: false,
	ShowMapInSearch: true,
	search: {
		destination: null,
		sortBy: '',
		adults: '',
		children: '',
		bedrooms: '',
		bathrooms: '',
		dateFrom: '',
		dateTo: '',
		collections: '',
		onDemand: '',
		onPrice: '',
		searchedPriceRange: '',
		searchedTypes: '',
		mustHaves: '',
		amenities: '',
		geo: ''
	},
	searchparam: {
		geo: null,
		adults: null
	}
});

const propertyReducer = (state = JSON.parse(initialState), action) => {
	switch (action.type) {
		case actionTypes.UPDATE_SHOWINMAPSEARCH: {
			return {
				...state,
				ShowMapInSearch: action.data
			}
		}
		case actionTypes.UPDATE_SEARCH_PARAMS: {
			return {
				...state,
				searchparam: {
					...state.searchparam,
					...action.data
				}
			}
		}
		case actionTypes.UPDATE_SEARCH_VALUES: {
			return {
				...state,
				search: {
					...state.search,
					...action.data
				}
			}
		}
		case actionTypes.LOADING_RESERVATION_REPORTS: {
			return {
				...state,
				isLoading: true
			}
		}
		case actionTypes.RESERVATION_REPORTS_LOADED: {
			return {
				...state,
				reservationReports: action.data,
				isLoading: false
			}
		}
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
		case actionTypes.VALID_SEARCH_DESTINATION_CHECK: {
			return {
				...state,
				validsearchdestination: action.data
			}
		}
		case actionTypes.FLAG_WISHLIST_MODEL: {
			return {
				...state,
				flagwishlistmodel: action.data
			}
		}
		default:
			return state;
	}
};

export default propertyReducer;
