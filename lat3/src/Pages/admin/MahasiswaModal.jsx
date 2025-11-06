import { useEffect, useState } from "react";

const initialForm = {
    nim: "",
    nama: "",
    status: false,
};

export default function MahasiswaModal({
    isModalOpen,
    onClose,
    onSubmit,
    selectedMahasiswa,
}) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const isEditMode = !!selectedMahasiswa;

    useEffect(() => {
    if (!isModalOpen) return;
    if (selectedMahasiswa) {
        setForm({
        nim: selectedMahasiswa.nim || "",
        nama: selectedMahasiswa.nama || "",
        status: !!selectedMahasiswa.status,
        });
    } else {
        setForm(initialForm);
    }

    setErrors({});
    }, [isModalOpen, selectedMahasiswa]);

  // setelah SEMUA hook, baru kita boleh return null
    if (!isModalOpen) {
    return null;
    }

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
    }));
    };

    const validate = () => {
    const newErrors = {};
    if (!form.nim.trim()) newErrors.nim = "NIM wajib diisi.";
    if (!form.nama.trim()) newErrors.nama = "Nama wajib diisi.";
    return newErrors;
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    const v = validate();
    if (Object.keys(v).length > 0) {
        setErrors(v);
        return;
    }

    if (typeof onSubmit === "function") onSubmit(form);
    if (typeof onClose === "function") onClose();
    };

    return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">
            {isEditMode ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIM */}
            <label className="block">
            <span className="text-sm text-slate-600">NIM</span>
            <input
                name="nim"
                value={form.nim}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="A11.2023.xxxxx"
                readOnly={isEditMode}
            />
            {errors.nim && (
                <p className="mt-1 text-xs text-red-500">{errors.nim}</p>
            )}
            </label>

          {/* NAMA */}
            <label className="block">
            <span className="text-sm text-slate-600">Nama</span>
            <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Nama lengkap"
            />
            {errors.nama && (
                <p className="mt-1 text-xs text-red-500">{errors.nama}</p>
            )}
            </label>

          {/* STATUS */}
            <label className="inline-flex items-center gap-2">
            <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
            />
            <span className="text-sm text-slate-700">Aktif?</span>
            </label>

          {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-2">
            <button
                type="button"
                onClick={onClose}
                className="rounded-xl border px-4 py-2 hover:bg-slate-50"
            >
                Batal
            </button>
            <button
                type="submit"
                className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
            >
                {isEditMode ? "Update" : "Simpan"}
            </button>
            </div>
        </form>
        </div>
    </div>
    );
}
