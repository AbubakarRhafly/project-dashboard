// src/Utils/Apis/UsersApi.jsx
import axios from "../../Utils/AxiosInstance";

// Cari user by email (case-insensitive dilakukan di caller)
export async function findUserByEmail(emailLower) {
    // json-server bisa filter: /users?email=...
    const res = await axios.get("/users", { params: { email: emailLower } });
    // json-server mengembalikan array
    return Array.isArray(res.data) && res.data.length ? res.data[0] : null;
}
