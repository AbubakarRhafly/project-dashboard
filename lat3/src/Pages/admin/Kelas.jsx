import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import axios from "../../Utils/AxiosInstance.jsx";
import { toastError } from "../../Utils/Helpers/ToastHelpers.jsx";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";

import { useMahasiswa, useUpdateMahasiswa } from "../../Utils/Hooks/useMahasiswa.jsx";
import { useKelas, useStoreKelas, useUpdateKelas, useDeleteKelas } from "../../Utils/Hooks/useKelas.jsx";

import KelasTable from "./KelasTable.jsx";

const unwrap = (res) => res?.data ?? res;
const pickArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rows)) return payload.rows;
    return [];
};

const DEFAULT_MAX_SKS = 24;

function num(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
}

export default function Kelas() {
    // ====== Fetch master data ======
    const { data: mahasiswa = [] } = useMahasiswa();
    const { mutate: updateMahasiswa } = useUpdateMahasiswa();

    const { data: kelas = [], isLoading: loadingKelas } = useKelas();
    const { mutate: storeKelas } = useStoreKelas();
    const { mutate: updateKelas } = useUpdateKelas();
    const { mutate: removeKelas } = useDeleteKelas();

    // Dosen & Mata Kuliah (langsung query biar gak tergantung hook lain)
    const { data: dosen = [] } = useQuery({
        queryKey: ["dosen"],
        queryFn: async () => pickArray(unwrap(await axios.get("/dosen"))),
        initialData: [],
    });

    const { data: matakuliah = [] } = useQuery({
        queryKey: ["matakuliah"],
        queryFn: async () => pickArray(unwrap(await axios.get("/matakuliah"))),
        initialData: [],
    });

    // ====== Maps ======
    const mkById = useMemo(() => new Map(matakuliah.map((m) => [m.id, m])), [matakuliah]);
    const dosenById = useMemo(() => new Map(dosen.map((d) => [d.id, d])), [dosen]);
    const mhsById = useMemo(() => new Map(mahasiswa.map((m) => [m.id, m])), [mahasiswa]);

    // ====== Compute SKS used maps (based on kelas + matakuliah.sks) ======
    const { mhsSksUsed, dosenSksUsed } = useMemo(() => {
        const mMap = new Map();
        const dMap = new Map();

        for (const k of kelas) {
            const mk = mkById.get(k.mataKuliahId);
            const sks = num(mk?.sks);

            // dosen
            if (k.dosenId != null) {
                dMap.set(k.dosenId, (dMap.get(k.dosenId) ?? 0) + sks);
            }

            // mahasiswa
            const ids = Array.isArray(k.mahasiswaIds) ? k.mahasiswaIds : [];
            for (const mid of ids) {
                mMap.set(mid, (mMap.get(mid) ?? 0) + sks);
            }
        }

        return { mhsSksUsed: mMap, dosenSksUsed: dMap };
    }, [kelas, mkById]);

    // ====== UI State ======
    const [isModalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add"); // add | edit
    const [form, setForm] = useState({
        id: "",
        mataKuliahId: "",
        dosenId: "",
        mahasiswaIds: [],
    });

    const openAdd = () => {
        setMode("add");
        setForm({ id: "", mataKuliahId: "", dosenId: "", mahasiswaIds: [] });
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setMode("edit");
        setForm({
            id: row.id,
            mataKuliahId: row.mataKuliahId ?? "",
            dosenId: row.dosenId ?? "",
            mahasiswaIds: Array.isArray(row.mahasiswaIds) ? row.mahasiswaIds : [],
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirmDelete();
        if (!ok) return;
        removeKelas(id);
    };

    // ====== Helpers for constraints ======
    const currentKelas = useMemo(() => {
        if (mode !== "edit") return null;
        return kelas.find((k) => k.id === form.id) ?? null;
    }, [mode, kelas, form.id]);

    const oldMkSks = useMemo(() => {
        if (!currentKelas) return 0;
        const mkOld = mkById.get(currentKelas.mataKuliahId);
        return num(mkOld?.sks);
    }, [currentKelas, mkById]);

    const selectedMk = useMemo(() => mkById.get(form.mataKuliahId) ?? null, [mkById, form.mataKuliahId]);
    const selectedMkSks = num(selectedMk?.sks);

    // 1 MK = 1 Kelas (biar pasti 1 MK = 1 dosen)
    const mkAlreadyUsedByOther = useMemo(() => {
        if (!form.mataKuliahId) return false;
        return kelas.some((k) => k.mataKuliahId === form.mataKuliahId && k.id !== form.id);
    }, [kelas, form.mataKuliahId, form.id]);

    // Dosen capacity check (edit: remove old mk sks from old dosen if same kelas)
    const canPickDosen = (dosenId) => {
        const d = dosenById.get(dosenId);
        const max = num(d?.max_sks) || DEFAULT_MAX_SKS;

        const used = dosenSksUsed.get(dosenId) ?? 0;

        // kalau edit dan dosen ini adalah dosen lama pada kelas ini, kita subtract oldMkSks
        const subtract =
            currentKelas && currentKelas.dosenId === dosenId ? oldMkSks : 0;

        const newUsed = used - subtract + selectedMkSks;
        return newUsed <= max;
    };

    // Mahasiswa capacity check
    const wouldMhsExceed = (mhsId) => {
        const m = mhsById.get(mhsId);
        const max = num(m?.max_sks) || DEFAULT_MAX_SKS;
        const used = mhsSksUsed.get(mhsId) ?? 0;

        // kalau edit dan mhs ini sudah ada di kelas lama, subtract oldMkSks dulu
        const wasInOld =
            currentKelas &&
            Array.isArray(currentKelas.mahasiswaIds) &&
            currentKelas.mahasiswaIds.includes(mhsId);

        const subtract = wasInOld ? oldMkSks : 0;
        const newUsed = used - subtract + selectedMkSks;
        return newUsed > max;
    };

    // ====== Form events ======
    const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

    const toggleMahasiswa = (id) => {
        setForm((f) => {
            const exists = f.mahasiswaIds.includes(id);
            if (exists) {
                return { ...f, mahasiswaIds: f.mahasiswaIds.filter((x) => x !== id) };
            }
            return { ...f, mahasiswaIds: [...f.mahasiswaIds, id] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.mataKuliahId) return toastError("Mata Kuliah wajib dipilih.");
        if (!form.dosenId) return toastError("Dosen wajib dipilih.");
        if (form.mahasiswaIds.length === 0) return toastError("Minimal pilih 1 mahasiswa.");

        if (mkAlreadyUsedByOther) {
            return toastError("Mata Kuliah ini sudah dipakai di Kelas lain. (1 MK hanya boleh 1 Kelas)");
        }

        // dosen capacity
        if (!canPickDosen(form.dosenId)) {
            return toastError("SKS dosen melebihi batas maksimal.");
        }

        // mahasiswa capacity
        const bad = form.mahasiswaIds.find((id) => wouldMhsExceed(id));
        if (bad) {
            const m = mhsById.get(bad);
            return toastError(`Mahasiswa ${m?.nama ?? ""} melebihi Max SKS.`);
        }

        const payload = {
            mataKuliahId: form.mataKuliahId,
            dosenId: form.dosenId,
            mahasiswaIds: form.mahasiswaIds,
        };

        if (mode === "add") {
            storeKelas(payload, { onSuccess: () => setModalOpen(false) });
            return;
        }

        const ok = await confirmUpdate();
        if (!ok) return;

        updateKelas(
            { id: form.id, data: payload },
            { onSuccess: () => setModalOpen(false) }
        );
    };

    // ====== Rows for table ======
    const kelasRows = useMemo(() => {
        return kelas.map((k) => {
            const mk = mkById.get(k.mataKuliahId) ?? {};
            const d = dosenById.get(k.dosenId) ?? {};
            const mkSks = num(mk?.sks);

            const dosenMax = num(d?.max_sks) || DEFAULT_MAX_SKS;
            const dosenUsed = dosenSksUsed.get(k.dosenId) ?? 0;

            const mIds = Array.isArray(k.mahasiswaIds) ? k.mahasiswaIds : [];
            return {
                id: k.id,
                mkNama: mk?.nama ?? "-",
                mkKode: mk?.kode ?? "-",
                mkSks,
                dosenNama: d?.nama ?? "-",
                dosenMaxSks: dosenMax,
                dosenSksUsed: dosenUsed,
                jumlahMahasiswa: mIds.length,
                raw: k,
            };
        });
    }, [kelas, mkById, dosenById, dosenSksUsed]);

    // ====== Rekap SKS mahasiswa (tampil di bawah) ======
    const rekapMahasiswa = useMemo(() => {
        return mahasiswa
            .map((m) => {
                const used = mhsSksUsed.get(m.id) ?? 0;
                const max = num(m?.max_sks) || DEFAULT_MAX_SKS;
                return {
                    id: m.id,
                    nim: m.nim,
                    nama: m.nama,
                    used,
                    max,
                    sisa: max - used,
                };
            })
            .sort((a, b) => b.used - a.used);
    }, [mahasiswa, mhsSksUsed]);

    // ====== Rekap SKS dosen ======
    const rekapDosen = useMemo(() => {
        return dosen
            .map((d) => {
                const used = dosenSksUsed.get(d.id) ?? 0;
                const max = num(d?.max_sks) || DEFAULT_MAX_SKS;
                return {
                    id: d.id,
                    nidn: d.nidn,
                    nama: d.nama,
                    prodi: d.prodi,
                    used,
                    max,
                    sisa: max - used,
                };
            })
            .sort((a, b) => b.used - a.used);
    }, [dosen, dosenSksUsed]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Pengelolaan Kelas</h2>
                    <p className="text-slate-500 text-sm">
                        Pilih Mata Kuliah, Dosen, dan Mahasiswa + validasi Max SKS
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openAdd}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                >
                    + Buat Kelas
                </button>
            </div>

            {loadingKelas ? (
                <div className="p-6 text-sm text-slate-600">Memuat data…</div>
            ) : (
                <KelasTable rows={kelasRows} onEdit={openEdit} onDelete={handleDelete} />
            )}

            {/* Rekap SKS Mahasiswa */}
            <div className="rounded-2xl border bg-white shadow overflow-hidden">
                <div className="p-4 border-b">
                    <div className="font-semibold text-slate-900">Rekap SKS Mahasiswa</div>
                    <div className="text-xs text-slate-500">
                        Total SKS diambil dihitung dari kelas yang diikuti (berdasarkan SKS Mata Kuliah)
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">NIM</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">SKS Diambil</th>
                                <th className="px-4 py-3 text-left">Max SKS</th>
                                <th className="px-4 py-3 text-left">Sisa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rekapMahasiswa.map((m) => (
                                <tr key={m.id} className="border-t">
                                    <td className="px-4 py-3">{m.nim}</td>
                                    <td className="px-4 py-3">{m.nama}</td>
                                    <td className="px-4 py-3 font-medium">{m.used}</td>
                                    <td className="px-4 py-3">{m.max}</td>
                                    <td className="px-4 py-3">{m.sisa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rekap SKS Dosen */}
            <div className="rounded-2xl border bg-white shadow overflow-hidden">
                <div className="p-4 border-b">
                    <div className="font-semibold text-slate-900">Rekap SKS Dosen</div>
                    <div className="text-xs text-slate-500">
                        Total SKS mengajar dihitung dari kelas yang diajar (berdasarkan SKS Mata Kuliah)
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">NIDN</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Prodi</th>
                                <th className="px-4 py-3 text-left">SKS Mengajar</th>
                                <th className="px-4 py-3 text-left">Max SKS</th>
                                <th className="px-4 py-3 text-left">Sisa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rekapDosen.map((d) => (
                                <tr key={d.id} className="border-t">
                                    <td className="px-4 py-3">{d.nidn}</td>
                                    <td className="px-4 py-3">{d.nama}</td>
                                    <td className="px-4 py-3">{d.prodi}</td>
                                    <td className="px-4 py-3 font-medium">{d.used}</td>
                                    <td className="px-4 py-3">{d.max}</td>
                                    <td className="px-4 py-3">{d.sisa}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL ADD/EDIT */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-1">
                            {mode === "add" ? "Buat Kelas" : "Edit Kelas"}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">
                            1 MK hanya boleh 1 kelas → memastikan 1 MK = 1 Dosen.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* MK */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <label className="block">
                                    <span className="text-sm text-slate-600">Mata Kuliah</span>
                                    <select
                                        value={form.mataKuliahId}
                                        onChange={(e) => {
                                            setField("mataKuliahId", e.target.value);
                                            // reset pilihan dosen & mhs biar tidak “nyangkut”
                                            setField("dosenId", "");
                                            setField("mahasiswaIds", []);
                                        }}
                                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                                    >
                                        <option value="">-- pilih --</option>
                                        {matakuliah.map((mk) => {
                                            const used = kelas.some((k) => k.mataKuliahId === mk.id && k.id !== form.id);
                                            return (
                                                <option key={mk.id} value={mk.id} disabled={used}>
                                                    {mk.kode} - {mk.nama} ({mk.sks} sks){used ? " [sudah dipakai]" : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {mkAlreadyUsedByOther && (
                                        <div className="text-xs text-red-600 mt-1">
                                            Mata kuliah ini sudah dipakai kelas lain.
                                        </div>
                                    )}
                                </label>

                                {/* Dosen */}
                                <label className="block">
                                    <span className="text-sm text-slate-600">Dosen</span>
                                    <select
                                        value={form.dosenId}
                                        onChange={(e) => setField("dosenId", e.target.value)}
                                        disabled={!form.mataKuliahId}
                                        className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                                    >
                                        <option value="">-- pilih --</option>
                                        {dosen.map((d) => {
                                            const max = num(d?.max_sks) || DEFAULT_MAX_SKS;
                                            const used = dosenSksUsed.get(d.id) ?? 0;
                                            const ok = form.mataKuliahId ? canPickDosen(d.id) : true;

                                            return (
                                                <option key={d.id} value={d.id} disabled={!ok}>
                                                    {d.nama} • SKS {used}/{max} {!ok ? " [melewati max]" : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <div className="text-xs text-slate-500 mt-1">
                                        * Default Max SKS = {DEFAULT_MAX_SKS} kalau field <code>max_sks</code> belum ada.
                                    </div>
                                </label>
                            </div>

                            {/* Mahasiswa list */}
                            <div className="rounded-2xl border p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <div className="font-semibold text-slate-900">Pilih Mahasiswa</div>
                                        <div className="text-xs text-slate-500">
                                            Ditampilkan: SKS diambil / Max SKS. Checkbox otomatis disable kalau melewati Max.
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Terpilih: <b>{form.mahasiswaIds.length}</b>
                                        {selectedMk ? (
                                            <span className="text-xs text-slate-500"> • MK SKS: {selectedMkSks}</span>
                                        ) : null}
                                    </div>
                                </div>

                                {!form.mataKuliahId ? (
                                    <div className="text-sm text-slate-500 p-3">
                                        Pilih Mata Kuliah terlebih dahulu.
                                    </div>
                                ) : (
                                    <div className="max-h-[300px] overflow-auto border rounded-xl">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 text-slate-600 sticky top-0">
                                                <tr>
                                                    <th className="px-3 py-2 text-left">Pilih</th>
                                                    <th className="px-3 py-2 text-left">NIM</th>
                                                    <th className="px-3 py-2 text-left">Nama</th>
                                                    <th className="px-3 py-2 text-left">SKS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mahasiswa.map((m) => {
                                                    const used = mhsSksUsed.get(m.id) ?? 0;
                                                    const max = num(m?.max_sks) || DEFAULT_MAX_SKS;
                                                    const exceed = wouldMhsExceed(m.id);

                                                    const checked = form.mahasiswaIds.includes(m.id);
                                                    // kalau exceed tapi sudah checked, biarkan bisa uncheck
                                                    const disabled = exceed && !checked;

                                                    const after = checked ? used : used + selectedMkSks;

                                                    return (
                                                        <tr key={m.id} className="border-t hover:bg-slate-50">
                                                            <td className="px-3 py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    disabled={disabled}
                                                                    onChange={() => toggleMahasiswa(m.id)}
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2">{m.nim}</td>
                                                            <td className="px-3 py-2">{m.nama}</td>
                                                            <td className="px-3 py-2">
                                                                <span className={after > max ? "text-red-600 font-medium" : "font-medium"}>
                                                                    {after}
                                                                </span>
                                                                <span className="text-slate-400"> / {max}</span>
                                                                {disabled ? <span className="text-xs text-red-600"> • melebihi</span> : null}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                                >
                                    {mode === "add" ? "Simpan Kelas" : "Update Kelas"}
                                </button>
                            </div>
                        </form>

                        {/* small note: optional max_sks update */}
                        <div className="mt-4 text-xs text-slate-500">
                            Opsional pengembangan: tambahkan field <code>max_sks</code> di data Mahasiswa/Dosen melalui halaman CRUD masing-masing.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
