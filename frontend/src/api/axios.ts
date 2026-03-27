import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // port NestJS của bạn
  withCredentials: true,
});

// Gắn access token tự động
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (config.headers?.["X-Skip-Auth"]) {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});