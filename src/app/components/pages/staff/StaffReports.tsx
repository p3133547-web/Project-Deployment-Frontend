import { useState } from "react";
import { Download, TrendingUp, Users, BookOpen, BarChart2, Loader2 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  AreaChart, Area, PieChart, Pie, Legend,
} from "recharts";
import { useTheme } from "../../../context/ThemeContext";
import api from "@/lib/api";

const attendanceSummary = [
  { section: "III CSE A", above90: 22, between75_90: 35, below75: 11 },
  { section: "III CSE B", above90: 18, between75_90: 38, below75: 9 },
];

const marksDist = [
  { range: "90-100", count: 5 }, { range: "80-89", count: 18 },
  { range: "70-79", count: 24 }, { range: "60-69", count: 15 }, { range: "< 60", count: 6 },
];

const monthlyAttn = [
  { month: "Jan", "III CSE A": 91, "III CSE B": 88 },
  { month: "Feb", "III CSE A": 87, "III CSE B": 84 },
  { month: "Mar", "III CSE A": 83, "III CSE B": 80 },
  { month: "Apr", "III CSE A": 87, "III CSE B": 82 },
];

const pieData = [
  { name: "Passed (≥50%)", value: 58, fill: "#22c55e" },
  { name: "Borderline (40-50%)", value: 7, fill: "#f97316" },
  { name: "Arrears (<40%)", value: 3, fill: "#ef4444" },
];

const topStudents = [
  { rank: 1, name: "Isha Patel", roll: "21CS009", cgpa: 9.2, attendance: 98 },
  { rank: 2, name: "Geetha Menon", roll: "21CS007", cgpa: 9.0, attendance: 95 },
  { rank: 3, name: "Bhavya Nair", roll: "21CS002", cgpa: 8.9, attendance: 92 },
  { rank: 4, name: "Divya Pillai", roll: "21CS004", cgpa: 8.7, attendance: 90 },
  { rank: 5, name: "Aarav Sharma", roll: "21CS001", cgpa: 8.6, attendance: 91 },
];

const COLORS = ["#4f46e5", "#8b5cf6", "#f97316", "#f59e0b", "#ef4444"];

export function StaffReports() {
  const { isDark } = useTheme();
  const [reportType, setReportType] = useState<"attendance" | "marks" | "combined">("attendance");
  const [exporting, setExporting] = useState(false);

  // ── Dark-mode tokens ──────────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const tabBg   = isDark ? "#0f172a" : "#f1f5f9";
  const tabAct  = isDark ? "#1e293b" : "#ffffff";
  const gridColor = isDark ? "#334155" : "#f1f5f9";
  const tooltipStyle = { background: "#1e293b", border: "none", borderRadius: 10, color: "#f8fafc", fontSize: 12 };

  // ── CSV export ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      let rows: string[][] = [];
      let headers: string[] = [];
      if (reportType === "attendance" || reportType === "combined") {
        headers = ["Section", "Above 90%", "75–90%", "Below 75%"];
        rows = attendanceSummary.map(a => [
          a.section, String(a.above90), String(a.between75_90), String(a.below75)
        ]);
      } else {
        headers = ["Marks Range", "Student Count"];
        rows = marksDist.map(m => [m.range, String(m.count)]);
      }
      const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const csv = [headers, ...rows].map(r => r.map(escape).join(",")).join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `Academic_Report_${reportType}_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header card */}
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><BarChart2 className="w-5 h-5 text-blue-600" /></div>
          <div>
            <h2 style={{ fontWeight: 700, color: textPri }}>Academic Reports</h2>
            <p className="text-xs" style={{ color: textSub }}>CS301 · Data Structures · Spring 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex p-1 gap-1 rounded-xl" style={{ backgroundColor: tabBg }}>
            {(["attendance", "marks", "combined"] as const).map(t => (
              <button key={t} onClick={() => setReportType(t)}
                className="px-3 py-1.5 rounded-lg text-sm capitalize transition-all"
                style={{
                  backgroundColor: reportType === t ? tabAct : "transparent",
                  color: reportType === t ? "#4f46e5" : textSub,
                  fontWeight: reportType === t ? 600 : 400,
                  boxShadow: reportType === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}>
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            style={{ fontWeight: 500 }}>
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? "Generating…" : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "68", icon: Users,    bg: "bg-slate-100",   color: "text-slate-700"   },
          { label: "Avg Attendance",  value: "87%", icon: TrendingUp, bg: "bg-orange-50", color: "text-orange-500" },
          { label: "Class Average",   value: "74.6",icon: BookOpen,  bg: "bg-violet-50",  color: "text-violet-600"  },
          { label: "Arrear Students", value: "3",   icon: BarChart2, bg: "bg-red-50",     color: "text-red-600"    },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <p style={{ fontSize: 22, fontWeight: 700, color: textPri }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ fontWeight: 500, color: textMed }}>{s.label}</p>
          </div>
        ))}
      </div>

      {(reportType === "attendance" || reportType === "combined") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly attendance trend */}
          <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Monthly Attendance Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyAttn} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="aFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient>
                  <linearGradient id="bFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="III CSE A" stroke="#4f46e5" strokeWidth={2} fill="url(#aFill)" dot={{ r: 3, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="III CSE B" stroke="#8b5cf6" strokeWidth={2} fill="url(#bFill)" dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance breakdown */}
          <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Attendance Category Breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceSummary} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="section" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="above90" name="≥90%" fill="#22c55e" radius={[4,4,0,0]} maxBarSize={28} stackId="a" />
                <Bar dataKey="between75_90" name="75-90%" fill="#f97316" radius={[0,0,0,0]} maxBarSize={28} stackId="a" />
                <Bar dataKey="below75" name="<75%" fill="#ef4444" radius={[4,4,0,0]} maxBarSize={28} stackId="a" />
                <Legend wrapperStyle={{ fontSize: 11, color: textSub }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(reportType === "marks" || reportType === "combined") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Marks distribution */}
          <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Marks Distribution (CT2)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={marksDist} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {marksDist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pass/fail pie */}
          <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Result Overview</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: textSub }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top performers */}
      <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
        style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
          <p style={{ fontWeight: 600, color: textPri }}>Top Performers — CS301</p>
          <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg" style={{ fontWeight: 500 }}>Semester 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc", borderBottom: `1px solid ${border}` }}>
                {["Rank", "Roll No.", "Name", "CGPA", "Attendance"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs" style={{ fontWeight: 600, color: textSub }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topStudents.map(s => (
                <tr key={s.roll}
                  style={{ borderTop: `1px solid ${border}` }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <td className="px-5 py-3.5">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      s.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      s.rank === 2 ? "bg-slate-100 text-slate-600" :
                      s.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-500"
                    }`} style={{ fontWeight: 700 }}>{s.rank}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: textSub }}>{s.roll}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ fontWeight: 500, color: textPri }}>{s.name}</td>
                  <td className="px-5 py-3.5"><span className="text-blue-700 bg-blue-50 text-xs px-2.5 py-1 rounded-lg border border-blue-100" style={{ fontWeight: 700 }}>{s.cgpa}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? "#334155" : "#f1f5f9" }}>
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-xs" style={{ fontWeight: 500, color: textMed }}>{s.attendance}%</span>
                    </div>
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
