import api from "./axios";

export const getCampaigns = (filters = {}) =>
  api.get("/campaigns", { params: filters }).then((res) => res.data);
export const getUrgentCampaigns = () => api.get("/campaigns/urgent").then((res) => res.data);
export const getCampaignById = (id) => api.get(`/campaigns/${id}`).then((res) => res.data);
export const createCampaign = (formData) =>
  api.post("/campaigns", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);
export const updateCampaign = (id, formData) =>
  api.put(`/campaigns/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);
export const addCampaignUpdate = (id, formData) =>
  api.post(`/campaigns/${id}/updates`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);
export const uploadSupportingDocument = (campaignId, formData) =>
  api
    .post(`/campaigns/${campaignId}/supporting-documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
export const deleteSupportingDocument = (campaignId, documentId) =>
  api.delete(`/campaigns/${campaignId}/supporting-documents/${documentId}`).then((res) => res.data);
export const updateExpenses = (campaignId, expenses) =>
  api.put(`/campaigns/${campaignId}/expenses`, { expenses }).then((res) => res.data);
