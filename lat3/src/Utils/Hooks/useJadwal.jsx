import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllJadwal,
    storeJadwal,
    updateJadwal,
    deleteJadwal,
} from "../Apis/JadwalApi.jsx";
import { toastError, toastSuccess } from "../Helpers/ToastHelpers.jsx";

const pickArray = (payload) => {
    // support axios normal (res.data) atau interceptor (res langsung)
    const d = payload?.data ?? payload;

    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.rows)) return d.rows;

    return [];
};

// GET
export const useJadwal = () =>
    useQuery({
        queryKey: ["jadwal"],
        queryFn: getAllJadwal,
        select: (res) => pickArray(res),
    });

// POST
export const useStoreJadwal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: storeJadwal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal"] });
            toastSuccess("Jadwal berhasil ditambahkan!");
        },
        onError: () => toastError("Gagal menambahkan jadwal."),
    });
};

// PUT
export const useUpdateJadwal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateJadwal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal"] });
            toastSuccess("Jadwal berhasil diperbarui!");
        },
        onError: () => toastError("Gagal memperbarui jadwal."),
    });
};

// DELETE
export const useDeleteJadwal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteJadwal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal"] });
            toastSuccess("Jadwal berhasil dihapus!");
        },
        onError: () => toastError("Gagal menghapus jadwal."),
    });
};
