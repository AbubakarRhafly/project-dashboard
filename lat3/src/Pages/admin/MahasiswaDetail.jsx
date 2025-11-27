// src/pages/admin/MahasiswaDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getMahasiswa } from "../../Utils/Apis/MahasiswaApi";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

export default function MahasiswaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMahasiswa = async () => {
    try {
      const res = await getMahasiswa(Number(id)); // JSON-Server id number
      setMahasiswa(res.data);
    } catch (err) {
      console.error(err);
      toastError("Gagal mengambil data mahasiswa");
      setMahasiswa(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMahasiswa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p className="text-center">Memuat data...</p>;
  if (!mahasiswa) return <p className="text-center">Data tidak ditemukan</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Detail Mahasiswa</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border px-3 py-1 hover:bg-slate-50"
        >
          Kembali
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-slate-500">NIM</dt>
            <dd className="text-slate-900 font-medium">{mahasiswa.nim}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Nama</dt>
            <dd className="text-slate-900 font-medium">{mahasiswa.nama}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Status</dt>
            <dd>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 text-xs">
                {mahasiswa.status ? "Aktif" : "Nonaktif"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">ID</dt>
            <dd className="text-slate-900 font-medium">{mahasiswa.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
