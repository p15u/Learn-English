import axiosClient from "./axiosClient";

const publicApi = {
  getAll: (params) => {
    const url = "/public";
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/public/${id}`;
    return axiosClient.get(url);
  },

  post: (vocabSet) => {
    const url = "/public";
    return axiosClient.post(url, vocabSet);
  },
};

export default publicApi;
