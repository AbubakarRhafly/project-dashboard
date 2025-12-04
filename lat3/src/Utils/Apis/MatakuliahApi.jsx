import api from "../../Utils/AxiosInstance";

export const getAllMataKuliah = () => api.get("/matakuliah");
export const getMataKuliah    = (id) => api.get(`/matakuliah/${id}`);
export const storeMataKuliah  = (data) => api.post("/matakuliah", data);
export const updateMataKuliah = (id, data) => api.put(`/matakuliah/${id}`, data);
export const deleteMataKuliah = (id) => api.delete(`/matakuliah/${id}`);
