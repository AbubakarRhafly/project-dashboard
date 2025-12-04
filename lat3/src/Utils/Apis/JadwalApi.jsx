import api from "../../Utils/AxiosInstance";

export const getAllJadwal = () => api.get("/Jadwal");
export const getJadwal    = (id) => api.get(`/Jadwal/${id}`);
export const storeJadwal  = (data) => api.post("/Jadwal", data);
export const updateJadwal = (id, data) => api.put(`/Jadwal/${id}`, data);
export const deleteJadwal = (id) => api.delete(`/Jadwal/${id}`);
