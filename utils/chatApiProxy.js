import axios from 'axios';

export const getSessions = () => {
  return getGetRequest('sessions');
};

const resolveApiUrl = (url) => {
  return `/chat/api/${url}`;
};

const getGetRequest = (url, params) => {
  const apiUrl = resolveApiUrl(url);
  return axios
    .create({
      params,
    })
    .get(apiUrl)
    .then((response) => {
      return response.data;
    });
};
