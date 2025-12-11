import axios from "../AxiosInstance";

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

//Login.jsx
export async function findUserByEmail(emailLower) {
    const res = await axios.get("/users", { params: { email: emailLower } });
    return Array.isArray(res.data) && res.data.length ? res.data[0] : null;
}
