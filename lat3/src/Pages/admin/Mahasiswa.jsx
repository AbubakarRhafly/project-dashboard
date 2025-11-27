import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// RELATIVE imports (hindari "@/")
import MahasiswaTable from "./MahasiswaTable.jsx";
import {
    getAllMahasiswa,
    storeMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
} from "../../Utils/Apis/MahasiswaApi.jsx";

// (opsional) jika pakai toast/swal
// import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers.jsx";
// import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";

export default function Mahasiswa() {
    const navigate = useNavigate();

    const [mahasiswa, setMahasiswa] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal & form sederhana (boleh digabung dengan modal milikmu)
    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add"); // 'add' | 'edit'
    const [form, setForm] = useState({ id: "", nim: "", nama: "" });

    // ---- fetch list
    const fetchMahasiswa = async () => {
        try {
            setLoading(true);
            const res = await getAllMahasiswa();
            setMahasiswa(res.data || []);
        } catch (e) {
            console.error(e);
            // toastError?.("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMahasiswa();
    }, []);

    // ---- handlers
    const openAdd = () => {
        setMode("add");
        setForm({ id: "", nim: "", nama: "" });
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setMode("edit");
        // pastikan id ada (dari json-server)
        setForm({ id: row.id, nim: row.nim ?? "", nama: row.nama ?? "" });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteMahasiswa(id);
            // toastSuccess?.("Data berhasil dihapus");
            fetchMahasiswa();
        } catch (e) {
            console.error(e);
            // toastError?.("Gagal menghapus data");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nim.trim() || !form.nama.trim()) {
            alert("NIM dan Nama wajib diisi");
            return;
        }

        try {
            if (mode === "add") {
                // json-server akan buat id baru otomatis jika id tidak dikirim
                await storeMahasiswa({ nim: form.nim, nama: form.nama });
                // toastSuccess?.("Data berhasil ditambahkan");
            } else {
                await updateMahasiswa(form.id, { nim: form.nim, nama: form.nama });
                // toastSuccess?.("Data berhasil diperbarui");
            }
            setModalOpen(false);
            fetchMahasiswa();
        } catch (e) {
            console.error(e);
            // toastError?.("Operasi gagal");
        }
    };

    // ---- UI (jangan pernah return null supaya tidak terlihat blank)
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Mahasiswa</h2>
                    <p className="text-slate-500 text-sm">CRUD via JSON-Server (axios)</p>
                </div>
                <button type="button" onClick={openAdd}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
                    + Tambah
                </button>
            </div>

            {loading ? (
                <div className="p-6 text-sm text-slate-600">Memuat data…</div>
            ) : (
                <MahasiswaTable
                    data={mahasiswa}
                    onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                />
            )}

            {/* Modal sederhana (boleh diganti komponen modal milikmu) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {mode === "add" ? "Tambah Mahasiswa" : "Edit Mahasiswa"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block">
                                <span className="text-sm text-slate-600">NIM</span>
                                <input
                                    name="nim" value={form.nim} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="A11.2020.xxxxx"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm text-slate-600">Nama</span>
                                <input
                                    name="nama" value={form.nama} onChange={handleChange}
                                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    placeholder="Nama lengkap"
                                />
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="rounded-xl border px-4 py-2 hover:bg-slate-50">
                                    Batal
                                </button>
                                <button type="submit"
                                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800">
                                    {mode === "add" ? "Simpan" : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
