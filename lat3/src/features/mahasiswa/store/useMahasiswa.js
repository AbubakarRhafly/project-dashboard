import { useState, useMemo, useCallback } from "react";
import { mahasiswaList as seed } from "/src/Data/Dummy.js";

function validate(form, rows, index) {
  const errors = {};
  if (!form.nim) errors.nim = "NIM wajib diisi";
  if (!form.nama) errors.nama = "Nama wajib diisi";
  const duplicate = rows.some((r, i) => r.nim === form.nim && i !== index);
  if (duplicate) errors.nim = "NIM sudah terdaftar";
  return errors;
}

export function useMahasiswa() {
  const [rows, setRows] = useState(() => (Array.isArray(seed) ? seed : []));
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ mode: "add", index: -1, nim: "", nama: "", status: true });
  const [errors, setErrors] = useState({});

  const resetForm = useCallback(() => {
    setForm({ mode: "add", index: -1, nim: "", nama: "", status: true });
    setErrors({});
  }, []);

  const openAdd = useCallback(() => { resetForm(); setModalOpen(true); }, [resetForm]);

  const openEdit = useCallback((idx) => {
    const m = rows[idx];
    setForm({ mode: "edit", index: idx, nim: m.nim, nama: m.nama, status: !!m.status });
    setErrors({});
    setModalOpen(true);
  }, [rows]);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === "nim") {
      const onlyDigits = value.replace(/\D+/g, "");
      setForm((f) => ({ ...f, nim: onlyDigits }));
      return;
    }
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault?.();
    const errs = validate(form, rows, form.index);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (form.mode === "add") {
      setRows((prev) => [...prev, { nim: form.nim, nama: form.nama, status: !!form.status }]);
      setModalOpen(false);
      resetForm();
    } else {
      const ok = confirm("Simpan perubahan data mahasiswa?");
      if (!ok) return;
      setRows((prev) =>
        prev.map((r, i) => i === form.index ? { nim: form.nim, nama: form.nama, status: !!form.status } : r)
      );
      setModalOpen(false);
      resetForm();
    }
  }, [form, rows, resetForm]);

  const handleDelete = useCallback((idx) => {
    const m = rows[idx];
    const ok = confirm(`Hapus data ${m.nama} (NIM ${m.nim})?`);
    if (!ok) return;
    setRows((prev) => prev.filter((_, i) => i !== idx));
  }, [rows]);

  const data = useMemo(() => [...rows].sort((a, b) => (a.nim > b.nim ? 1 : -1)), [rows]);

  return {
    data, rows, total: rows.length,
    isModalOpen, form, errors,
    openAdd, openEdit, closeModal,
    handleChange, handleSubmit, handleDelete,
  };
}
