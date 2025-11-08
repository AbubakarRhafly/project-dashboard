import Swal from "sweetalert2";

export const confirmLogout = async () => {
    const result = await Swal.fire({
        title: "Konfirmasi Logout",
        text: "Yakin ingin keluar dari akun?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, logout",
        cancelButtonText: "Batal",
        confirmButtonColor: "#dc2626",
    });
    return result.isConfirmed;
};

export const confirmDeleteMahasiswa = async (nama, nim) => {
    const result = await Swal.fire({
        title: "Hapus Mahasiswa?",
        html: `Yakin ingin menghapus data <b>${nama}</b><br/>NIM: <code>${nim}</code>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#dc2626",
    });
    return result.isConfirmed;
};

export const confirmSaveMahasiswa = async (isEditMode) => {
    const result = await Swal.fire({
        title: isEditMode ? "Simpan Perubahan?" : "Simpan Data?",
        text: isEditMode
            ? "Perubahan data mahasiswa akan disimpan."
            : "Data mahasiswa baru akan ditambahkan.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, simpan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#16a34a",
    });
    return result.isConfirmed;
};
