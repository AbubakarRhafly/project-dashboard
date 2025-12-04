import { useState } from "react";
import { registerUser, getUserByEmail } from "../Utils/Apis/AuthApi.jsx";
import { toastSuccess, toastError } from "../Utils/Helpers/ToastHelpers.jsx";

export default function Register() {
    const [f, setF] = useState({ name: "", email: "", password: "", role: "user" });
    const onChange = e => setF(s => ({ ...s, [e.target.name]: e.target.value }));

    const submit = async e => {
        e.preventDefault();
        if (!f.name || !f.email || !f.password) { toastError("Semua field wajib"); return; }
        const exists = await getUserByEmail(f.email);
        if ((exists.data ?? []).length) { toastError("Email sudah terdaftar"); return; }
        await registerUser(f);
        toastSuccess("Registrasi berhasil");
        setF({ name: "", email: "", password: "", role: "user" });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl border space-y-3">
            <h2 className="text-xl font-semibold">Registrasi</h2>
            <form onSubmit={submit} className="space-y-3">
                <input name="name" value={f.name} onChange={onChange} placeholder="Nama" className="w-full rounded-xl border px-3 py-2" />
                <input name="email" value={f.email} onChange={onChange} placeholder="Email" className="w-full rounded-xl border px-3 py-2" type="email" />
                <input name="password" value={f.password} onChange={onChange} placeholder="Password" className="w-full rounded-xl border px-3 py-2" type="password" />
                <button className="rounded-xl bg-slate-900 text-white px-4 py-2 w-full">Daftar</button>
            </form>
        </div>
    );
}
