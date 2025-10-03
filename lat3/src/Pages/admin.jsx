import { useState } from "react";
import AdminShell from "../komponen/layouts/AdminShell.jsx";
import Card from "../komponen/sections/Card.jsx";
import Modal from "../komponen/sections/Modal.jsx";
import Form from "../komponen/blocks/Form.jsx";
import FormField from "../komponen/blocks/FormField.jsx";
import Button from "../komponen/ui/Button.jsx";

export default function Admin() {
    const [open, setOpen] = useState(false);

    return (
    <AdminShell title="Users" onAdd={() => setOpen(true)}>
      {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <Card><p className="text-sm text-slate-500">Total Users</p><p className="mt-2 text-2xl font-semibold">1,284</p></Card>
        <Card><p className="text-sm text-slate-500">Active Today</p><p className="mt-2 text-2xl font-semibold">167</p></Card>
        <Card><p className="text-sm text-slate-500">New Signups</p><p className="mt-2 text-2xl font-semibold">32</p></Card>
        <Card><p className="text-sm text-slate-500">Churn</p><p className="mt-2 text-2xl font-semibold">2.1%</p></Card>
        </div>

      {/* Table */}
        <Card title="User List" actions={
        <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Show</span>
            <select className="rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1.5">
            <option>10</option><option>25</option><option>50</option>
            </select>
        </div>
        }>
        <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-700 -mx-6">
            <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300">
                <tr>
                {["Name","Email","Role","Status","Actions"].map(h=>(
                    <th key={h} className={`px-6 py-3 font-medium ${h==="Actions"?"text-right":"text-left"}`}>{h}</th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {[
                {name:"Abubakar Rhafly Eka Putera", email:"rhaflyekaputera@company.com", role:"Admin",   status:"Active"},
                {name:"Della Septi",                email:"dell.sept@company.com",         role:"Editor",  status:"Pending"},
                {name:"Abu Jibril",                 email:"abujibril@company.com",         role:"Viewer",  status:"Disabled"},
                ].map((u)=>(
                <tr key={u.email} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-3 font-medium">{u.name}</td>
                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-6 py-3">{u.role}</td>
                    <td className="px-6 py-3">
                    {u.status==="Active"   && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</span>}
                    {u.status==="Pending"  && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">Pending</span>}
                    {u.status==="Disabled" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">Disabled</span>}
                    </td>
                    <td className="px-6 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                        <Button variant="outline" onClick={()=>setOpen(true)}>Edit</Button>
                        <Button variant="danger">Delete</Button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </Card>

      {/* Modal */}
        <Modal
        open={open}
        onClose={()=>setOpen(false)}
        title="Add User"
        footer={
            <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={()=>setOpen(false)}>Save</Button>
            </div>
        }
        >
        <Form onSubmit={(e)=>{e.preventDefault(); setOpen(false);}}>
            <FormField id="name"  label="Name"  type="text"  required />
            <FormField id="email" label="Email" type="email" required />
            <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2.5">
                <option>Admin</option><option>Editor</option><option>Viewer</option>
            </select>
            </div>
        </Form>
        </Modal>
    </AdminShell>
    );
}
