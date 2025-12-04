import api from "../../Utils/AxiosInstance";

export const getAllDosen = () => api.get("/dosen");
export const getDosen    = (id) => api.get(`/dosen/${id}`);
export const storeDosen  = (data) => api.post("/dosen", data);
export const updateDosen = (id, data) => api.put(`/dosen/${id}`, data);
export const deleteDosen = (id) => api.delete(`/dosen/${id}`);
