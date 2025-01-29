import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "http://vps-4110266-x.dattaweb.com:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("access_token"); // Token de las cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

