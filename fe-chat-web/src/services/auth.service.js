import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8686/api';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const res = await axios({
      ...options,
      url: API_URL + endpoint,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        ...(options.headers || {}),
      },
    });

    return res.data;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      try {
        const refreshRes = await axios.post(`${API_URL}/customers/refresh-token`, null, {
          headers: {
            Authorization: `Bearer ${getRefreshToken()}`,
          },
        });

        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const retryRes = await axios({
          ...options,
          url: API_URL + endpoint,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            ...(options.headers || {}),
          },
        });

        return retryRes.data;
      } catch (refreshError) {
        console.error('❌ Refresh token hết hạn');
        throw refreshError;
      }
    }

    throw err;
  }
};

export default fetchWithAuth;
