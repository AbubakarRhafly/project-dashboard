import axios from "../AxiosInstance";
export const registerUser = (payload) => axios.post("/users", payload);
export const getUserByEmail = (email) => axios.get(`/users?email=${encodeURIComponent(email)}`);
