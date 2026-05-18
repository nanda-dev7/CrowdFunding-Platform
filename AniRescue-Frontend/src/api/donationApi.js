import api from "./axios";

export const createDonationOrder = (data) => api.post("/donations/create-order", data).then((res) => res.data);
export const confirmDonation = (data) => api.post("/donations/confirm", data).then((res) => res.data);
export const getMyDonations = () => api.get("/users/me/donations").then((res) => res.data);
