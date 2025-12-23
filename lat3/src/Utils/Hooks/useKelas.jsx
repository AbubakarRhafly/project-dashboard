import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllKelas, storeKelas, updateKelas, deleteKelas } from "../Apis/KelasApi.jsx";
import { toastError, toastSuccess } from "../Helpers/ToastHelpers.jsx";

const pickArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rows)) return payload.rows;
    return [];
};

// GET
export const useKelas = () =>
    useQuery({
        queryKey: ["kelas"],
        queryFn: getAllKelas,
        select: (res) => pickArray(res?.data ?? res),
    });

// POST
export const useStoreKelas = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: storeKelas,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas berhasil dibuat!");
        },
        onError: () => toastError("Gagal membuat kelas."),
    });
};

// PUT
export const useUpdateKelas = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateKelas(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas berhasil diperbarui!");
        },
        onError: () => toastError("Gagal memperbarui kelas."),
    });
};

// DELETE
export const useDeleteKelas = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteKelas,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas berhasil dihapus!");
        },
        onError: () => toastError("Gagal menghapus kelas."),
    });
};
