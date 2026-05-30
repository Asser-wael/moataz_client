import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// detect local or production
const isLocal = window.location.hostname === "localhost";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("accessToken")
    ) {
      original._retry = true;

      try {
        const refreshURL = isLocal
          ? "http://localhost:3001/refresh"
          : `${API_URL}/refresh`;

        const res = await axios.post(
          refreshURL,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (err) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;