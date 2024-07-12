import axios from "axios";

import store from "../redux/store";
import { setLoggedInUser } from "../redux/actions/userActions";

const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: false,
  baseURL: window.APP_CONFIG.VH_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { token } = store.getState()?.userReducer?.info?.keycloak;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    const state = store.getState();

    if (error?.response?.status === 401) {
      state.userReducer.info.keycloak.logout();
      store.dispatch(setLoggedInUser(null));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
