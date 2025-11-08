import { useMemo, useState } from "react";
import { mahasiswalist as seed } from "../../Data/Dummy.js";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers.jsx";

import MahasiswaModal from "./MahasiswaModal.jsx";
import MahasiswaTable from "./MahasiswaTable.jsx";

export default function Mahasiswa() {
    // state mahasiswa
    const [mahasiswa, setMahasiswa] = useState(() => seed);
    // state selected mahasiswa
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
    // state modal
    const [isModalOpen, setModalOpen] = useState(false);

    const total = useMemo(() => mahasiswa.length, [mahasiswa]);

    // tambah mahasiswa baru
    const storeMahasiswa = (data) => {
        setMahasiswa((prev) => [...prev, data]);
    };

    // update mahasiswa dengan nim
    const updateMahasiswa = (data) => {
        setMahasiswa((prev) =>
            prev.map((m) => (m.nim === data.nim ? { ...m, ...data } : m))
        );
    };

    // delete mahasiswa dengan nim
    const deleteMahasiswa = (nim) => {
        setMahasiswa((prev) => prev.filter((m) => m.nim !== nim));
    };

    // buka modal tambah
    const openAddModal = () => {
        setSelectedMahasiswa(null);
        setModalOpen(true);
    };

    // buka modal edit, isi selectedMahasiswa dari nim
    const openEditModal = (nim) => {
        const found = mahasiswa.find((m) => m.nim === nim);
        if (found) {
            setSelectedMahasiswa(found);
            setModalOpen(true);
        }
    };

    // handle submit dari modal:
    const handleSubmit = (formData) => {
        try {
            if (selectedMahasiswa) {
                updateMahasiswa(formData);
                toastSuccess("Data mahasiswa berhasil diperbarui.");
            } else {
                storeMahasiswa(formData);
                toastSuccess("Data mahasiswa berhasil disimpan.");
            }
        } catch (error) {
            console.error(error);
            toastError("Terjadi kesalahan saat menyimpan data mahasiswa.");
        }
    };

    // handle delete, terima nim
    const handleDelete = (nim) => {
        try {
            deleteMahasiswa(nim);
            toastSuccess("Data mahasiswa berhasil dihapus.");
        } catch (error) {
            console.error(error);
            toastError("Terjadi kesalahan saat menghapus data mahasiswa.");
        }
    };

    return (
        <div className="space-y-4">
            {/* HEADER SAMA SEPERTI LIST LAMA */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mahasiswa</h2>
                    <p className="text-slate-500 text-sm">
                        Kelola data Mahasiswa (CRUD via state)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Total: <span className="font-medium text-slate-700">{total}</span>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAddModal}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                >
                    + Tambah
                </button>
            </div>

            {/* TABLE */}
            <MahasiswaTable
                mahasiswa={mahasiswa}
                openEditModal={openEditModal}
                onDelete={handleDelete}
            />

            {/* MODAL */}
            <MahasiswaModal
                isModalOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                selectedMahasiswa={selectedMahasiswa}
            />
        </div>
    );
}
