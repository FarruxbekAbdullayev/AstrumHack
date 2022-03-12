import Axios from 'axios';
import store from '../redux';
import { clearAccount } from '../redux/auth/reducer';

const baseURL = process.env.NODE_ENV === 'development'?'http://localhost:9999':'https://api.sparta-fitness.uz';
const axios = Axios.create({ baseURL, withCredentials: true });

axios.interceptors.request.use((configs) => {
  return configs;
});

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    console.log(error.response);
    if (error?.response?.status === 401) {
      return store.dispatch(clearAccount());
    }
    return Promise.reject(error);
  }
);

export { axios as default };
