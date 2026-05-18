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
export const uploadMedicalDocument = (campaignId, formData) =>
  api
    .post(`/campaigns/${campaignId}/medical-documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
export const deleteMedicalDocument = (campaignId, documentId) =>
  api.delete(`/campaigns/${campaignId}/medical-documents/${documentId}`).then((res) => res.data);
