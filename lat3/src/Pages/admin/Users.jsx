// src/pages/admin/Users.jsx
import { useEffect, useState } from "react";
import { getUsers, updateUserRolePermissions } from "../../Utils/Apis/UsersApi.jsx";
import { toastError, toastSuccess } from "../../Utils/Helpers/ToastHelpers.jsx";
import { getAuth } from "../../Utils/Helpers/Authz.js";

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

            {/* Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Nama</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Role</th>
                                <th className="px-4 py-3 text-left">Permissions</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        Tidak ada user
                                    </td>
                                </tr>
                            ) : (
                                rows.map((u) => (
                                    <tr key={u.id} className="border-t">
                                        <td className="px-4 py-3">{u.id}</td>
                                        <td className="px-4 py-3">{u.name}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">{u.role || "-"}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-slate-600">
                                                {(Array.isArray(u.permissions) ? u.permissions : []).join(", ") || "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => openEdit(u)}
                                                className="rounded-xl border px-3 py-1 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {open && selected && (
                <div className="fixed inset-0 z-50 grid place-items-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeModal}
                    />
                    <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-lg border border-slate-200 max-h-[85vh] overflow-auto">
                        <div className="p-5 border-b">
                            <div className="font-semibold text-slate-900">Edit User</div>
                            <div className="text-sm text-slate-500">{selected.email}</div>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Role */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => applyRolePreset(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
                                >
                                    <option value="admin">admin</option>
                                    <option value="staff">staff</option>
                                    <option value="viewer">viewer</option>
                                </select>
                                <p className="mt-1 text-xs text-slate-500">
                                    Mengubah role akan mengisi permission secara otomatis (bisa di-edit lagi).
                                </p>
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="text-sm font-medium text-slate-700">Permissions</label>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ALL_PERMS.map((p) => (
                                        <label
                                            key={p}
                                            className="flex items-center gap-2 rounded-xl border px-3 py-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={role === "admin" ? true : perms.includes(p)}
                                                disabled={role === "admin"}
                                                onChange={() => togglePerm(p)}
                                            />
                                            <span className="text-sm">{p}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t flex items-center justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="rounded-xl border px-4 py-2 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={save}
                                className="rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
