import axiosClient from "./axiosClient";

const vocabApi = {
  getAll: (params) => {
    const url = "/vocabs";
    return axiosClient.get(url, { params });
  },

  get: (id) => {
    const url = `/vocabs/${id}`;
    return axiosClient.get(url);
  },

  post: (vocabSet) => {
    const url = "/vocabs";
    return axiosClient.post(url, vocabSet);
  },

  put: (vocabSet, id) => {
    const url = `/vocabs/${id}`;
    return axiosClient.put(url, vocabSet);
  },

  delete: (id) => {
    const url = `/vocabs/${id}`;
    return axiosClient.delete(url);
  },
};

export default vocabApi;
