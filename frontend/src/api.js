import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const uploadImage = (formData) => {
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const checkStatus = (jobId) => {
  return axios.get(`${API_URL}/status/${jobId}`);
};
