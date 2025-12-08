// src/Utils/Apis/UsersApi.jsx
import axios from "../AxiosInstance";

// Ambil semua user
export const getUsers = async () => {
    const res = await axios.get("/users");
    return res.data;
};

// Update role + permissions user tertentu
export const updateUserRolePermissions = async (id, payload) => {
    // payload: { role: "admin" | "staff" | "viewer", permissions: string[] }
    const res = await axios.patch(`/users/${id}`, payload);
    return res.data;
};

// Dipakai di Login.jsx
export async function findUserByEmail(emailLower) {
    // json-server bisa filter: /users?email=...
    const res = await axios.get("/users", { params: { email: emailLower } });
    // json-server mengembalikan array
    return Array.isArray(res.data) && res.data.length ? res.data[0] : null;
}
