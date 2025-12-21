import axios from "../../Utils/AxiosInstance.jsx";

const unwrap = (res) => res?.data ?? res; // ✅ support axios normal & interceptor

export const getAllMahasiswa = async () => unwrap(await axios.get("/mahasiswa"));
export const getMahasiswa    = async (id) => unwrap(await axios.get(`/mahasiswa/${id}`));
export const storeMahasiswa  = async (data) => unwrap(await axios.post("/mahasiswa", data));
export const updateMahasiswa = async (id, data) => unwrap(await axios.put(`/mahasiswa/${id}`, data));
export const deleteMahasiswa = async (id) => unwrap(await axios.delete(`/mahasiswa/${id}`));
