import { useQueries } from "@tanstack/react-query";
import axios from "../AxiosInstance.jsx";

const unwrap = (res) => res?.data ?? res;

const pickArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rows)) return payload.rows;
    return [];
};

const fetchList = (path) => async () => {
    try {
        const res = await axios.get(path);
        const payload = unwrap(res);
        return pickArray(payload);
    } catch (err) {
        console.error("[Dashboard] Fetch failed:", path, err);
        return [];
    }
};

export function useDashboardData() {
    const results = useQueries({
        queries: [
            { queryKey: ["dashboard", "mahasiswa"], queryFn: fetchList("/mahasiswa") },
            { queryKey: ["dashboard", "dosen"], queryFn: fetchList("/dosen") },
            { queryKey: ["dashboard", "matakuliah"], queryFn: fetchList("/matakuliah") },
            { queryKey: ["dashboard", "jadwal"], queryFn: fetchList("/jadwal") },
            { queryKey: ["dashboard", "users"], queryFn: fetchList("/users") },
        ],
    });

    const [mahasiswa, dosen, matakuliah, jadwal, users] = results;

    const isLoading = results.some((r) => r.isLoading);
    const isFetching = results.some((r) => r.isFetching);

    return { mahasiswa, dosen, matakuliah, jadwal, users, isLoading, isFetching };
}
