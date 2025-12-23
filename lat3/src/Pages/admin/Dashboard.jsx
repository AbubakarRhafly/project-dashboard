import DashboardCharts from "../../komponen/sections/DashboardCharts.jsx";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-slate-500 text-sm">
          Ringkasan data
        </p>
      </div>

      <DashboardCharts />
    </div>
  );
}
