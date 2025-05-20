export const PATH_Welcome = '/welcome';
export const PATH_SIGNUP = '/signup';

// export const PATH_HOME = '/home';
export const PATH_LOGIN = '/login';
export const PATH_SIGNOUT = 'signOut';
export const PATH_FORGOT_PASSWORD = '/forgotPassword';
export const PATH_VERIFY_CODE = '/verifycode/:id';
export const PATH_SIGNUP_THANKS = '/signupthanks';
export const PATH_SEARCH = '/search';
export const VILLA_PATH_SEARCH = '/search/:country=:country&villa=:villa&lat=:lat&lng=:lng';
// export const VILLA_PATH_SEARCH = '/propertySearch/:queryParams';

export const PATH_SHUB = '/shub';
export const PATH_MAP = '/map';
export const PATH_CLIENTS = '/clients';
export const PATH_RESERVATIONS = '/reservations';
export const PATH_FAVORITES = '/favorites';
export const PATH_REPORTS = '/reports';
export const PATH_PROPERTY = '/property';
export const PATH_CALENDAR = '/calendar';
export const PATH_CALENDAR_ID = '/calendar/:id';
export const PATH_PROPERTY_ID = '/property/:id';
export const PATH_LINK = '/link/:linkid';
export const PATH_PROPERTY_EDIT = '/propertyEdit';
export const PATH_PROPERTY_CLIENT = '/propertyClient/:id';
export const PATH_PROPERTY_X = '/property/x';
export const PATH_RESERVE = '/reserve';
export const PATH_PROFILE = '/profile';
export const PATH_HOT_DESTINATIONS = '/hotdestinations';
export const PATH_WISH_LIST = '/wishlist';
export const PATH_COLLECTIONS = '/collections';
export const PATH_INTOUCH = '/intouch';
export const PATH_FAQ = '/faq';
export const PATH_ADMIN = '/admin';
export const PATH_TERMS_CONDITIONS = '/terms-and-conditions';
export const PATH_SEARCH_NEW = '/searchnew'; //By Jaison
export const PATH_RETURN_FLYWIRE = '/request-to-book-flywire';
//  this is to test if on push goes to vercel2..
const constants = { 
	UPSALE:0.86, //price upsale for villatracker
	AGENCY_COMMISION : 0.1, //how much is agency commition 
	ENV: 'LOCAL',
	SHUB_URL: 'https://api.villatracker.com',  //https://api.triangle.luxury
	//SHUB_URL: 'http://localhost:3333',
	BASE_URL: 'https://vt-be.vercel.app/',
    // BASE_URL: 'http://localhost:8080',
	BASE_URL2: 'https://vt-backend-8zwvrrlxf-smiling-house.vercel.app',
	BASE_URL1: 'http://vtbackend-env.eba-b3vxhzrg.us-east-2.elasticbeanstalk.com',
	GLOBAL_ACTION_INIT_STATE: 'GLOBAL_ACTION_INIT_STATE',
	PAGING_PAGE_SIZE: 12,
	PAGING_CLIENT_SIZE: 20,
	PAGING_WISHLIST_SIZE: 10,
	PAGING_AGENCIES_SIZE: 20,
	REACT_APP_STORAGE_SIGNED_USER_KEY: "selfit-frontend-user-data",

	TOAST_TYPE_INFO: 'toast_info',
	TOAST_TYPE_SUCCESS: 'toast_success',
	TOAST_TYPE_WARN: 'toast_warn',
	TOAST_TYPE_ERROR: 'toast_error',
};
 
export default constants;
