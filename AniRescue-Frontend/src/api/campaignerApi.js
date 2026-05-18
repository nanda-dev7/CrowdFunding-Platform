import api from "./axios";

export const applyCampaigner = (formData) =>
  api.post("/campaigner/apply", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);
export const getCampaignerStatus = () => api.get("/campaigner/status").then((res) => res.data);
export const getCampaignerDashboard = () => api.get("/campaigner/dashboard").then((res) => res.data);
