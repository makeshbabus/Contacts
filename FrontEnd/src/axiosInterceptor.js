/*
Component : Axios Interceptor
*/
/** ****************************** Import Packages **************************** */
import axios from "axios";

var baseUrl = window.location.protocol + "//" + window.location.hostname + ":3000";

const requestAxios = axios.interceptors.request.use(async (config) => {
	var username = 'makesh';
	var password = 'password';
	config.headers["Authorization"] = "Basic " + btoa(username + ':' + password)
	config.baseURL = baseUrl;
	return config;
},
	error => {
		return Promise.reject(error);
	}
);

// Add a response interceptor
const responseAxios = axios.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	return Promise.reject();
});

export {
	requestAxios,
	responseAxios,
	baseUrl
};
