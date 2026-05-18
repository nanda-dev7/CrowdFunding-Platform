import api from "./axios";

export const getAdminStats = () => api.get("/admin/stats").then((res) => res.data);
export const getCampaignerRequests = () => api.get("/admin/campaigner-requests").then((res) => res.data);
export const approveCampaigner = (id) => api.put(`/admin/campaigner/${id}/approve`).then((res) => res.data);
export const rejectCampaigner = (id) => api.put(`/admin/campaigner/${id}/reject`).then((res) => res.data);
export const getPendingCampaigns = () => api.get("/admin/campaigns/pending").then((res) => res.data);
export const approveCampaign = (id) => api.put(`/admin/campaigns/${id}/approve`).then((res) => res.data);
export const rejectCampaign = (id) => api.put(`/admin/campaigns/${id}/reject`).then((res) => res.data);
export const markCampaignUrgent = (id, urgencyLevel) =>
  api.put(`/admin/campaigns/${id}/urgent`, { urgencyLevel }).then((res) => res.data);
export const getUsers = () => api.get("/admin/users").then((res) => res.data);
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role }).then((res) => res.data);
