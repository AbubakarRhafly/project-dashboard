import api from "../../Utils/AxiosInstance";

export const getAllJadwal = () => api.get("/jadwal");
export const getJadwal    = (id) => api.get(`jadwal/${id}`);
export const storeJadwal  = (data) => api.post("/jadwal", data);
export const updateJadwal = (id, data) => api.put(`/jadwal/${id}`, data);
export const deleteJadwal = (id) => api.delete(`/jadwal/${id}`);
