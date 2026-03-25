import axios from "axios";

const instance = axios.create({
  baseURL: "https://task-manager-backend-ngp5.onrender.com",
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default instance;
