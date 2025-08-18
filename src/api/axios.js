// ../api/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true, // if using cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosInstance as axios };
