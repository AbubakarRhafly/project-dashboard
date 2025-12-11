export default function UsersTable({ data, onEdit }) {
    const rows = Array.isArray(data) ? data : [];

    // kalau kosong
    if (rows.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 text-center">
                Tidak ada user
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* MOBILE: card per user, tidak perlu geser-geser */}
            <div className="space-y-3 md:hidden">
                {rows.map((u) => (
                    <div
                        key={u.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="text-xs text-slate-500">ID #{u.id}</div>
                                <div className="text-sm font-semibold text-slate-900">
                                    {u.name}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {u.email}
                                </div>
                            </div>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 capitalize">
                                {u.role || "–"}
                            </span>
                        </div>

                        <div className="mt-3">
                            <div className="text-[11px] font-medium text-slate-500">
                                Permissions
                            </div>
                            <p className="mt-1 text-[11px] text-slate-700 break-words">
                                {(Array.isArray(u.permissions) ? u.permissions : []).join(
                                    ", "
                                ) || "-"}
                            </p>
                        </div>

                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={() => onEdit?.(u)}
                                className="rounded-xl border px-3 py-1 text-xs font-medium hover:bg-slate-50"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP: tabel biasa */}
            <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden">
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
                            {rows.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="px-4 py-3">{u.id}</td>
                                    <td className="px-4 py-3">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{u.role || "-"}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-slate-600">
                                            {(
                                                Array.isArray(u.permissions)
                                                    ? u.permissions
                                                    : []
                                            ).join(", ") || "-"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => onEdit?.(u)}
                                            className="rounded-xl border px-3 py-1 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
