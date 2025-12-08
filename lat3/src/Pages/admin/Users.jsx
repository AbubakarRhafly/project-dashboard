import { useEffect, useMemo, useState } from "react";
import { getUsers, updateUserRolePermissions } from "../../Utils/Apis/UsersApi.jsx";
import { toastError, toastSuccess } from "../../Utils/Helpers/ToastHelpers.jsx";
import { getAuth } from "../../Utils/Helpers/Authz.js";

const ROLE_PRESETS = {
    admin: {
        role: "admin",
        permissions: ["*"],
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

    const canEditSelf = true; // bisa lu set false kalau mau larang

    const auth = useMemo(() => getAuth(), []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setRows(data);
        } catch (e) {
            console.error(e);
            toastError("Gagal ambil data users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openEdit = (u) => {
        setSelected(u);
        setRole(u.role || "viewer");
        setPerms(Array.isArray(u.permissions) ? u.permissions : []);
        setOpen(true);
    };

    const togglePerm = (p) => {
        setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
    };

    const applyRolePreset = (r) => {
        setRole(r);
        if (r === "admin") {
            setPerms(ALL_PERMS); // admin full
            return;
        }
        const preset = ROLE_PRESETS[r];
        setPerms(preset ? preset.permissions : []);
    };

    const save = async () => {
        if (!selected) return;

        // optional: larang edit diri sendiri
        if (!canEditSelf && auth?.id === selected.id) {
            toastError("Tidak boleh mengubah role akun yang sedang login.");
            return;
        }

        try {
            const payload = {
                role,
                permissions: role === "admin" ? ALL_PERMS : perms,
            };

            await updateUserRolePermissions(selected.id, payload);
            toastSuccess("Role & permission berhasil diupdate.");
            setOpen(false);
            setSelected(null);
            await load();

            // 🔥 kalau user yang diubah adalah yang sedang login → update localStorage juga
            const current = getAuth();
            if (current?.id === selected.id) {
                localStorage.setItem(
                    "auth",
                    JSON.stringify({
                        ...current,
                        role: payload.role,
                        permissions: payload.permissions,
                    })
                );
            }
        } catch (e) {
            console.error(e);
            toastError("Gagal mengupdate user.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
                    <p className="text-sm text-slate-500">Ubah role dan permission pada user.</p>
                </div>
            </div>

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
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : rows.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Tidak ada user</td></tr>
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
                    <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-lg border border-slate-200 max-h-[85vh] overflow-auto">
                        <div className="p-5 border-b">
                            <div className="font-semibold text-slate-900">Edit User</div>
                            <div className="text-sm text-slate-500">{selected.email}</div>
                        </div>

                        <div className="p-5 space-y-4">
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
                                <p className="mt-1 text-xs text-slate-500">Memilih role bisa auto-set permission.</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700">Permissions</label>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ALL_PERMS.map((p) => (
                                        <label key={p} className="flex items-center gap-2 rounded-xl border p-3">
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
                                onClick={() => setOpen(false)}
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
