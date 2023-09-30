import axios from 'axios';
import cookie from 'cookie';
import Cookies from 'js-cookie';
const api = axios.create({
  // withCredentials:true
});
api.interceptors.request.use((config) => {
  const authToken = Cookies.get('authToken'); 
  const { csrftoken} = cookie.parse(document.cookie);
  if (csrftoken) {
    config.headers['X-CSRFTOKEN'] = csrftoken;
  }
  if (authToken) {
    config.headers['Authorization'] = 'Token '+authToken; 
  }

  return config;
});
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
