import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.common.Authorization = "Bearer " + token;
      
    }
    return config;
  },
  function (error) {
    // console.log("error req: ", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // console.log("error response api: ", error);
    return Promise.reject(error);
  }
);

export default instance;
