import axios from "axios";
import queryString from "query-string";

import { BASE_API_URL } from "@env";

const axiosClient = axios.create({
  baseURL: "https://us-central1-vocablearningapp.cloudfunctions.net",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default axiosClient;
