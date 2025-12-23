import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    PieChart,
    Pie,
    Legend,
} from "recharts";

import { useDashboardData } from "../../Utils/Hooks/useDashboardData.jsx";

function Card({ title, value, onClick, isDark }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "text-left rounded-2xl border p-4 shadow-sm transition",
                isDark
                    ? "border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-900",
            ].join(" ")}
        >
            <div className={isDark ? "text-sm text-slate-300" : "text-sm text-slate-500"}>
                {title}
            </div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            <div className={isDark ? "mt-2 text-xs text-slate-400" : "mt-2 text-xs text-slate-400"}>
                Klik untuk buka halaman
            </div>
        </button>
    );
}

function groupCount(list, keyGetter) {
    const map = new Map();
    for (const item of list) {
        const k = (keyGetter(item) ?? "Unknown").toString().trim() || "Unknown";
        map.set(k, (map.get(k) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

// Ambil tahun 4 digit dari nim (contoh: A11.2023.15240 -> 2023)
function getYearFromNim(nim) {
    const s = (nim ?? "").toString();
    const match = s.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : "Unknown";
}

// Ambil jurusan dari prefix nim (contoh: A11.2023.15240 -> A11)
function getJurusanFromNim(nim) {
    const s = (nim ?? "").toString();
    const prefix = s.split(".")[0]?.trim();
    return prefix || "Unknown";
}

export default function DashboardCharts() {
    const navigate = useNavigate();
    const chartRef = useRef(null);

    const { mahasiswa, dosen, matakuliah, jadwal, users, isLoading, isFetching } =
        useDashboardData();

    const mhsAll = mahasiswa.data ?? [];
    const dsn = dosen.data ?? [];
    const mk = matakuliah.data ?? [];
    const jdwAll = jadwal.data ?? [];
    const usr = users.data ?? [];

    // =========================
    // State (filters & toggles)
    // =========================
    const [yearFilter, setYearFilter] = useState("ALL");
    const [jurusanFilter, setJurusanFilter] = useState("ALL");
    const [hariFilter, setHariFilter] = useState("ALL");

    const [isAnim, setIsAnim] = useState(true);
    const [isDark, setIsDark] = useState(false);

    // =========================
    // Filter options
    // =========================
    const yearOptions = useMemo(() => {
        const set = new Set(mhsAll.map((x) => getYearFromNim(x?.nim)));
        return Array.from(set).sort();
    }, [mhsAll]);

    const jurusanOptions = useMemo(() => {
        const set = new Set(mhsAll.map((x) => getJurusanFromNim(x?.nim)));
        return Array.from(set).sort();
    }, [mhsAll]);

    const hariOptions = useMemo(() => {
        const set = new Set(jdwAll.map((x) => (x?.hari ?? "Unknown").toString().trim() || "Unknown"));
        return Array.from(set).sort();
    }, [jdwAll]);

    // =========================
    // Filtered data
    // =========================
    const mhs = useMemo(() => {
        return mhsAll.filter((x) => {
            const y = getYearFromNim(x?.nim);
            const j = getJurusanFromNim(x?.nim);

            const okYear = yearFilter === "ALL" ? true : y === yearFilter;
            const okJur = jurusanFilter === "ALL" ? true : j === jurusanFilter;

            return okYear && okJur;
        });
    }, [mhsAll, yearFilter, jurusanFilter]);

    const jdw = useMemo(() => {
        return jdwAll.filter((x) => {
            const h = (x?.hari ?? "Unknown").toString().trim() || "Unknown";
            return hariFilter === "ALL" ? true : h === hariFilter;
        });
    }, [jdwAll, hariFilter]);

    // =========================
    // Charts data
    // =========================
    const barData = useMemo(() => {
        return [
            { name: "Mahasiswa", value: mhs.length },
            { name: "Dosen", value: dsn.length },
            { name: "Mata Kuliah", value: mk.length },
            { name: "Jadwal", value: jdw.length },
            { name: "Users", value: usr.length },
        ];
    }, [mhs.length, dsn.length, mk.length, jdw.length, usr.length]);

    const mhsByYear = useMemo(() => {
        const yearCount = new Map();
        for (const item of mhs) {
            const year = getYearFromNim(item?.nim);
            yearCount.set(year, (yearCount.get(year) ?? 0) + 1);
        }
        return Array.from(yearCount.entries())
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => (a.year > b.year ? 1 : -1));
    }, [mhs]);

    const jadwalByHari = useMemo(() => {
        return groupCount(jdw, (x) => x?.hari);
    }, [jdw]);

    const dosenByProdi = useMemo(() => {
        return groupCount(dsn, (x) => x?.prodi);
    }, [dsn]);

    // =========================
    // Export handlers
    // =========================
    const exportPNG = async () => {
        if (!chartRef.current) return;
        const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: null });
        const link = document.createElement("a");
        link.download = "dashboard-charts.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const exportPDF = async () => {
        if (!chartRef.current) return;
        const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "pt", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let y = 0;
        if (imgHeight <= pageHeight) {
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        } else {
            let remainingHeight = imgHeight;
            let position = 0;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                remainingHeight -= pageHeight;
                position -= pageHeight;
                if (remainingHeight > 0) pdf.addPage();
            }
        }

        pdf.save("dashboard-charts.pdf");
    };

    // =========================
    // Recharts theme tweaks
    // =========================
    const axisTick = { fill: isDark ? "#e2e8f0" : "#334155" };
    const gridStroke = isDark ? "#334155" : "#e2e8f0";

    if (isLoading) {
        return <div className="p-6 text-sm text-slate-600">Memuat dashboard…</div>;
    }

    return (
        <div
            className={[
                "space-y-4 rounded-2xl p-4",
                isDark ? "bg-slate-950 text-slate-100" : "bg-transparent text-slate-900",
            ].join(" ")}
        >
            {/* Toolbar: Filters + Export + Toggles */}
            <div
                className={[
                    "rounded-2xl border p-4 flex flex-col gap-3",
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                ].join(" ")}
            >
                <div className="flex flex-wrap gap-3 items-end">
                    {/* Filter Tahun */}
                    <div className="min-w-[180px]">
                        <label className={isDark ? "text-xs text-slate-300" : "text-xs text-slate-500"}>
                            Filter Tahun (Angkatan)
                        </label>
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className={[
                                "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none",
                                isDark
                                    ? "bg-slate-950 border-slate-700 text-slate-100"
                                    : "bg-white border-slate-200 text-slate-900",
                            ].join(" ")}
                        >
                            <option value="ALL">Semua</option>
                            {yearOptions.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Jurusan */}
                    <div className="min-w-[200px]">
                        <label className={isDark ? "text-xs text-slate-300" : "text-xs text-slate-500"}>
                            Filter Jurusan (Kode NIM)
                        </label>
                        <select
                            value={jurusanFilter}
                            onChange={(e) => setJurusanFilter(e.target.value)}
                            className={[
                                "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none",
                                isDark
                                    ? "bg-slate-950 border-slate-700 text-slate-100"
                                    : "bg-white border-slate-200 text-slate-900",
                            ].join(" ")}
                        >
                            <option value="ALL">Semua</option>
                            {jurusanOptions.map((j) => (
                                <option key={j} value={j}>
                                    {j}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Hari Jadwal */}
                    <div className="min-w-[170px]">
                        <label className={isDark ? "text-xs text-slate-300" : "text-xs text-slate-500"}>
                            Filter Hari (Jadwal)
                        </label>
                        <select
                            value={hariFilter}
                            onChange={(e) => setHariFilter(e.target.value)}
                            className={[
                                "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none",
                                isDark
                                    ? "bg-slate-950 border-slate-700 text-slate-100"
                                    : "bg-white border-slate-200 text-slate-900",
                            ].join(" ")}
                        >
                            <option value="ALL">Semua</option>
                            {hariOptions.map((h) => (
                                <option key={h} value={h}>
                                    {h}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-4 px-1">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isAnim}
                                onChange={(e) => setIsAnim(e.target.checked)}
                            />
                            Animasi
                        </label>

                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={isDark}
                                onChange={(e) => setIsDark(e.target.checked)}
                            />
                            Dark mode
                        </label>
                    </div>

                    {/* Export */}
                    <div className="flex gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={exportPNG}
                            className={[
                                "rounded-xl px-4 py-2 text-sm border",
                                isDark
                                    ? "border-slate-700 bg-slate-950 hover:bg-slate-800"
                                    : "border-slate-200 bg-white hover:bg-slate-50",
                            ].join(" ")}
                        >
                            Export PNG
                        </button>
                        <button
                            type="button"
                            onClick={exportPDF}
                            className={[
                                "rounded-xl px-4 py-2 text-sm border",
                                isDark
                                    ? "border-slate-700 bg-slate-950 hover:bg-slate-800"
                                    : "border-slate-200 bg-white hover:bg-slate-50",
                            ].join(" ")}
                        >
                            Export PDF
                        </button>
                    </div>
                </div>

                {isFetching && (
                    <div className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                        Memperbarui data…
                    </div>
                )}
            </div>

            {/* EXPORT AREA */}
            <div ref={chartRef} className="space-y-4">
                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <Card
                        isDark={isDark}
                        title="Mahasiswa (terfilter)"
                        value={mhs.length}
                        onClick={() => navigate("/admin/mahasiswa")}
                    />
                    <Card isDark={isDark} title="Dosen" value={dsn.length} onClick={() => navigate("/admin/dosen")} />
                    <Card
                        isDark={isDark}
                        title="Mata Kuliah"
                        value={mk.length}
                        onClick={() => navigate("/admin/matakuliah")}
                    />
                    <Card
                        isDark={isDark}
                        title="Jadwal (terfilter)"
                        value={jdw.length}
                        onClick={() => navigate("/admin/jadwal")}
                    />
                    <Card isDark={isDark} title="Users" value={usr.length} onClick={() => navigate("/admin/users")} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Chart 1: Bar */}
                    <div
                        className={[
                            "rounded-2xl border p-4 shadow-sm",
                            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                        ].join(" ")}
                    >
                        <div className="font-semibold">Jumlah Data (Bar)</div>
                        <div className={isDark ? "text-xs text-slate-400 mb-3" : "text-xs text-slate-500 mb-3"}>
                            Mahasiswa & Jadwal mengikuti filter
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={axisTick} />
                                    <YAxis allowDecimals={false} tick={axisTick} />
                                    <Tooltip />
                                    <Bar dataKey="value" isAnimationActive={isAnim} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Line */}
                    <div
                        className={[
                            "rounded-2xl border p-4 shadow-sm",
                            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                        ].join(" ")}
                    >
                        <div className="font-semibold">Mahasiswa per Angkatan (Line)</div>
                        <div className={isDark ? "text-xs text-slate-400 mb-3" : "text-xs text-slate-500 mb-3"}>
                            Tahun diambil dari NIM (A11.2023.xxxx)
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mhsByYear}>
                                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                                    <XAxis dataKey="year" tick={axisTick} />
                                    <YAxis allowDecimals={false} tick={axisTick} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" isAnimationActive={isAnim} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 3: Pie */}
                    <div
                        className={[
                            "rounded-2xl border p-4 shadow-sm",
                            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                        ].join(" ")}
                    >
                        <div className="font-semibold">Distribusi Jadwal per Hari (Pie)</div>
                        <div className={isDark ? "text-xs text-slate-400 mb-3" : "text-xs text-slate-500 mb-3"}>
                            Pie chart berdasarkan field <code>hari</code>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip />
                                    <Legend />
                                    <Pie
                                        data={jadwalByHari}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                        isAnimationActive={isAnim}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bonus chart */}
                    <div
                        className={[
                            "rounded-2xl border p-4 shadow-sm",
                            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
                        ].join(" ")}
                    >
                        <div className="font-semibold">Dosen per Prodi (Bonus)</div>
                        <div className={isDark ? "text-xs text-slate-400 mb-3" : "text-xs text-slate-500 mb-3"}>
                            Pengembangan tambahan
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dosenByProdi}>
                                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={axisTick} />
                                    <YAxis allowDecimals={false} tick={axisTick} />
                                    <Tooltip />
                                    <Bar dataKey="value" isAnimationActive={isAnim} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* small note */}
                <div className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                    Catatan: Filter “Jurusan” menggunakan prefix NIM (contoh: A11). Kalau dataset kamu punya field
                    fakultas/jurusan asli, tinggal ganti function pemetaan.
                </div>
            </div>
        </div>
    );
}
