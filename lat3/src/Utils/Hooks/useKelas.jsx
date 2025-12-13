import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllJadwal,
    storeJadwal,
    updateJadwal,
    deleteJadwal,
} from "../Apis/JadwalApi.jsx";
import { toastError, toastSuccess } from "../Helpers/ToastHelpers.jsx";

export const useKelas = () =>
    useQuery({
        queryKey: ["kelas"],
        queryFn: getAllJadwal,
        select: (res) => res?.data ?? [],
    });

export const useStoreKelas = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: storeJadwal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas/Jadwal berhasil ditambahkan!");
        },
        onError: () => toastError("Gagal menambahkan kelas/jadwal."),
    });
};

export const useUpdateKelas = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateJadwal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas/Jadwal berhasil diperbarui!");
        },
        onError: () => toastError("Gagal memperbarui kelas/jadwal."),
    });
};

export const useDeleteKelas = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteJadwal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toastSuccess("Kelas/Jadwal berhasil dihapus!");
        },
        onError: () => toastError("Gagal menghapus kelas/jadwal."),
    });
};
