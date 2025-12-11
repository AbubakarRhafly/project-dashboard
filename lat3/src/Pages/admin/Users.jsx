import { useEffect, useState } from "react";
import UsersTable from "./UsersTable.jsx";

import { getUsers, updateUserRolePermissions } from "../../Utils/Apis/UsersApi.jsx";
import { toastError, toastSuccess } from "../../Utils/Helpers/ToastHelpers.jsx";
import { getAuth } from "../../Utils/Helpers/Authz.js";
import { confirmUpdate } from "../../Utils/Helpers/SwalHelpers.jsx";

// Preset role → permission default
const ROLE_PRESETS = {
    admin: {
        role: "admin",
        permissions: ["*"], // nanti tetap kita expand ke ALL_PERMS
    },
    staff: {
        role: "staff",
        permissions: ["mahasiswa.read", "dosen.read", "jadwal.read", "matakuliah.read"],
    },
    viewer: {
        role: "viewer",
        permissions: ["mahasiswa.read", "dosen.read", "jadwal.read", "matakuliah.read"],
    },
};

// Semua permission yang dipakai di sistem
const ALL_PERMS = [
    "users.read",
    "users.write",
    "mahasiswa.read",
    "mahasiswa.write",
    "dosen.read",
    "dosen.write",
    "matakuliah.read",
    "matakuliah.write",
    "jadwal.read",
    "jadwal.write",
];

export default function Users() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [role, setRole] = useState("viewer");
    const [perms, setPerms] = useState([]);

    const auth = getAuth(); // user yang lagi login

    // ambil semua user dari json-server
    const load = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setRows(data);
        } catch (err) {
            console.error(err);
            toastError("Gagal ambil data users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // buka modal edit
    const openEdit = (user) => {
        setSelected(user);
        setRole(user.role || "viewer");
        setPerms(Array.isArray(user.permissions) ? user.permissions : []);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setSelected(null);
        setRole("viewer");
        setPerms([]);
    };

    const togglePerm = (perm) => {
        setPerms((prev) =>
            prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
        );
    };

    const applyRolePreset = (r) => {
        setRole(r);

        if (r === "admin") {
            // admin = full access
            setPerms(ALL_PERMS);
            return;
        }

        const preset = ROLE_PRESETS[r];
        setPerms(preset ? preset.permissions : []);
    };

    const save = async () => {
        if (!selected) return;

        const payload = {
            role,
            permissions: role === "admin" ? ALL_PERMS : perms,
        };

        try {
            // konfirmasi dulu (biar sama kaya halaman lain)
            const ok = await confirmUpdate();
            if (!ok) return;

            await updateUserRolePermissions(selected.id, payload);
            toastSuccess("Role & permission berhasil diupdate.");

            // Kalau user yang diupdate adalah user yang lagi login → sync localStorage
            if (auth && auth.id === selected.id) {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        ...auth,
                        role: payload.role,
                        permissions: payload.permissions,
                    })
                );
            }

            await load();
            closeModal();
        } catch (err) {
            console.error(err);
            toastError("Gagal mengupdate user.");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Manajemen User</h1>
                    <p className="text-sm text-slate-500">
                        Ubah role dan permission user untuk mengatur akses fitur.
                    </p>
                </div>
            </div>

            {/* Table / list */}
            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    Memuat data…
                </div>
            ) : (
                <UsersTable data={rows} onEdit={openEdit} />
            )}

            {/* Modal edit role & permission */}
            {open && selected && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Ubah Role & Permission
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {selected.name} ({selected.email})
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-full border px-3 py-1 text-sm hover:bg-slate-50"
                            >
                                Tutup
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-[200px,1fr]">
                            {/* Kolom kiri: role preset */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    Role
                                </h3>
                                <div className="space-y-2">
                                    {["admin", "staff", "viewer"].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => applyRolePreset(r)}
                                            className={`w-full rounded-xl border px-3 py-2 text-left text-sm capitalize transition ${
                                                role === r
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                    : "border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kolom kanan: permission detail */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700">
                                    Permissions
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Centang permission yang boleh diakses user ini.
                                </p>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    {ALL_PERMS.map((p) => (
                                        <label
                                            key={p}
                                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs hover:bg-slate-100"
                                        >
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-slate-300"
                                                checked={
                                                    role === "admin"
                                                        ? true
                                                        : perms.includes(p)
                                                }
                                                onChange={() => togglePerm(p)}
                                                disabled={role === "admin"}
                                            />
                                            <span className="font-medium text-slate-700">
                                                {p}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={save}
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
