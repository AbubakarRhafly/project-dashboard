import Swal from "sweetalert2";

export const confirmLogout = async () => {
    const r = await Swal.fire({
        title: "Yakin ingin logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Batal",
    });
    return r.isConfirmed;
};

export const confirmDelete = async () => {
    const res = await Swal.fire({
        title: "Hapus data?",
        text: "Aksi ini tidak bisa dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
        focusCancel: true,
    });
    return res.isConfirmed;
};

export const confirmUpdate = async () => {
    const res = await Swal.fire({
        title: "Simpan perubahan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, simpan",
        cancelButtonText: "Batal",
        reverseButtons: true,
        focusCancel: true,
    });
    return res.isConfirmed;
};
