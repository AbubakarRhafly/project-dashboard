import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllMahasiswa,
    storeMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
} from "../Apis/MahasiswaApi.jsx";
import { toastError, toastSuccess } from "../Helpers/ToastHelpers.jsx";

// GET
export const useMahasiswa = () =>
    useQuery({
        queryKey: ["mahasiswa"],
        queryFn: getAllMahasiswa,
        select: (res) => res?.data ?? [],
    });

// POST
export const useStoreMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: storeMahasiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil ditambahkan!");
        },
        onError: () => toastError("Gagal menambahkan mahasiswa."),
    });
};

// PUT
export const useUpdateMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateMahasiswa(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil diperbarui!");
        },
        onError: () => toastError("Gagal memperbarui mahasiswa."),
    });
};

// DELETE
export const useDeleteMahasiswa = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMahasiswa,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
            toastSuccess("Mahasiswa berhasil dihapus!");
        },
        onError: () => toastError("Gagal menghapus mahasiswa."),
    });
};
