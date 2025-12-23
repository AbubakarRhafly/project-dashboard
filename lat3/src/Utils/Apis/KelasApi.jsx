import axios from "../../Utils/AxiosInstance.jsx";

const unwrap = (res) => res?.data ?? res;

export const getAllKelas = async () => unwrap(await axios.get("/kelas"));
export const storeKelas = async (data) => unwrap(await axios.post("/kelas", data));
export const updateKelas = async (id, data) => unwrap(await axios.put(`/kelas/${id}`, data));
export const deleteKelas = async (id) => unwrap(await axios.delete(`/kelas/${id}`));
