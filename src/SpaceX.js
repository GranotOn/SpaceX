import axios from "axios";

const api = (url, callback) => {
  /**
   * API call
   */
  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {})
    .finally(() => {
      if (callback) {
        callback();
      }
    });
};

export default api;
