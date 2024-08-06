import axios from "axios";
// import axiosRetry from "axios-retry";
// import { logout } from "./actions";

// create a new axios instance
const instance = axios.create({
  baseURL: "http://vesti-working-dev-new.us-east-1.elasticbeanstalk.com/api",
  // baseURL: "http://vesti-working-production.us-east-1.elasticbeanstalk.com/api",
});

const instance2 = axios.create({
  baseURL: "https://api.wevesti.com/api/v1",
  // baseURL: "https://syca-staging.wevesti.com/api/v1",
  // baseURL: 'http://syca-app-backend.eba-pe3mzmfm.us-east-1.elasticbeanstalk.com/api/v1',
});

const instance3 = axios.create({
  // baseURL: "https://elementapi.wevesti.com/api/",
  // baseURL: "https://stagingelementapi.wevesti.com/api/",
  baseURL: "https://pathwayapi.wevesti.com/",
});

/**
 * Get number of times to delay a request retry
 *
 * @param {number} [retryNumber=0]
 * @return {number}
 */
const retryDelay = (retryNumber = 0) => {
  const seconds = Math.pow(2, retryNumber) * 1000;
  const randomMs = 1000 * Math.random();
  return seconds + randomMs;
};

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  config.headers["x-fbo-secret"] = `vregsfef3313132rrrff44`;
  return config;
});

instance2.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  config.headers["x-fbo-secret"] = `vregsfef3313132rrrff44`;
  return config;
});

instance3.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  config.headers["x-fbo-secret"] = `vregsfef3313132rrrff44`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      // logout();
    }
    return Promise.reject(error);
  }
);

instance2.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      // logout();
    }
    return Promise.reject(error);
  }
);

instance3.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 401) {
      // logout();
    }
    return Promise.reject(error);
  }
);

// Retry failed requests
// axiosRetry(instance, {
//   retries: 3,
//   retryDelay,
//   retryCondition: axiosRetry.isRetryableError,
// });

/**
 * Performs a GET request
 *
 * @param  {string} path - API url for GET request
 * @returns {Promise<AxiosResponse<any>>} - A response with a typeof AxiosResponse
 */
export const sendGetRequest = async (path) => {
  const response = await instance({
    url: path,
    method: "get",
  });
  return response;
};

export const sendGetRequest2 = async (path) => {
  const response = await instance2({
    url: path,
    method: "get",
  });
  return response;
};
export const sendGetRequestElement = async (path) => {
  const response = await instance3({
    url: path,
    method: "get",
  });
  return response;
};
export const sendPostRequestElement = async (path) => {
  const response = await instance3({
    url: path,
    method: "post",
  });
  return response;
};

/**
 * Performs a POST request
 *
 * @param  {string} path - API url for POST request
 * @param  {Object} params - The data to be sent along with the request
 * @returns {Promise<AxiosResponse<any>>} - A response with a typeof AxiosResponse
 */
export const sendPostRequest = async (path, params) => {
  const response = await instance({
    url: path,
    method: "post",
    data: params,
  });
  return response;
};
export const sendPostRequest2 = async (path, params) => {
  const response = await instance2({
    url: path,
    method: "post",
    data: params,
  });
  return response;
};

/**
 * Performs a DELETE request
 *
 * @param  {string} path - API url for DELETE request
 * @returns {Promise<AxiosResponse<any>>} - A response with a typeof AxiosResponse
 */
export const sendDeleteRequest = async (path) => {
  const response = await instance({
    url: path,
    method: "delete",
  });
  return response;
};
export const sendDeleteRequest2 = async (path) => {
  const response = await instance2({
    url: path,
    method: "delete",
  });
  return response;
};

/**
 * Performs a PUT request
 *
 * @param  {string} path - API url for PUT request
 * @param  {Object} params - The data to be sent along with the request
 * @returns {Promise<AxiosResponse<any>>} - A response with a typeof AxiosResponse
 */
export const sendPutRequest = async (path, params) => {
  const response = await instance({
    url: path,
    method: "patch",
    data: params,
  });
  return response;
};
export const sendPutRequest2 = async (path, params) => {
  const response = await instance2({
    url: path,
    method: "patch",
    data: params,
  });
  return response;
};


const requests = [
  sendGetRequest,
  sendPostRequest,
  sendDeleteRequest,
  sendGetRequest2,
];
export default requests;
