import api from "./axios";

export const getDonorDashboard = () => api.get("/users/me/dashboard").then((res) => res.data);
