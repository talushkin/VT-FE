import { publicRequest } from "../../api/requestMethods";
import {
	getImageFailure,
	getImageStart,
	getImageSuccess,
	getProfileFailure,
	getProfileStart,
	getProfileSuccess,
	loginFailure,
	loginStart,
	loginSuccess,
	signupFailure,
	signupStart,
	signupSuccess,
} from "../reducers/userReducer";
// Agents
import { getAgentsFailure, getAgentsStart, getAgentsSuccess, } from "../reducers/AgentReducer";
import { toast } from "react-toastify";
//SIGNUP
export const handleSignup = async (dispatch, user) => {
	dispatch(signupStart());
	try {
		const res = await publicRequest.post("/agent/signup", user);
		//console.log("response from signup ==>", res);
		dispatch(signupSuccess(res.data));
		return res;
	} catch (error) {
		dispatch(signupFailure());
	}
};

//LOGIN
export const handleLogin = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await publicRequest.post("/agent/login", user);
		// console.log("response from login ==>", res);
		
		dispatch(loginSuccess(res.data?.user));
		return res;
	} catch (error) {
		console.log(error.response.data,"error--------")
 		dispatch(loginFailure());
		return null;
	}
};

export const handleGetProfile = async (dispatch, id) => {
	dispatch(getProfileStart());
	//console.log("getProfileStart >>");
	try {
		const res = await publicRequest.post(`/agent/get-profile`, { agentId: id });
		//console.log("response from getProfile ==>", res);
		dispatch(getProfileSuccess(res.data?.user));
		return res;
	} catch (error) {
		dispatch(getProfileFailure());
	}
};

export const handleUploadPic = async (dispatch, user) => {
	dispatch(getImageStart());
	try {
		const res = await publicRequest.post(`/agent/update-profile`, user);
		//console.log("response from update-profile ==>", res);
		dispatch(getImageSuccess(res.data?.doc));
		return res;
	} catch (error) {
		dispatch(getImageFailure());
	}
};

// Agents

export const handleGetAgents = async (dispatch, id) => {
	dispatch(getAgentsStart());
	//console.log("getAgentStart >>");
	try {
		const res = await publicRequest.post(`/agent/get-agents`, { userId: id });
		//console.log("response from getAgents ==>", res);
		dispatch(getAgentsSuccess(res.data?.Agents));
		return res;
	} catch (error) {
		dispatch(getAgentsFailure());
	}
};
