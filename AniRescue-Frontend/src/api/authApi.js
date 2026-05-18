import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data).then((res) => res.data);
export const loginUser = (data) => api.post("/auth/login", data).then((res) => res.data);
export const getMe = () => api.get("/auth/me").then((res) => res.data);
export const refreshToken = () => api.post("/auth/refresh").then((res) => res.data);
export const logoutUser = () => api.post("/auth/logout").then((res) => res.data)
