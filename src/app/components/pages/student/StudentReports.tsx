import { useState } from "react";
import {
  Download, FileText, BarChart2, TrendingUp, Calendar,
  CheckCircle2, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { attendanceApi, marksApi, AttendanceSummary, MarkOut, CGPASummary } from "@/lib/api";

type Status = "idle" | "loading" | "done" | "error";

// ── Client-side CSV generator ──────────────────────────────────────────────────
function triggerCSVDownload(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines   = [headers, ...rows].map(r => r.map(escape).join(",")).join("\r\n");
  const blob    = new Blob([lines], { type: "text/csv;charset=utf-8;" });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement("a");
  a.href        = url;
  a.download    = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Report definitions ─────────────────────────────────────────────────────────
const reportDefs = [
  {
    id:    "attendance",
    title: "Attendance Report",
    desc:  "Subject-wise attendance breakdown with eligibility status for the current semester.",
    icon:  Calendar,
    color: "text-orange-500",
    bg:    "bg-orange-50",
  },
  {
    id:    "marks",
    title: "Internal Marks Report",
    desc:  "CT1, CT2, Assignment and Practical marks across all subjects with grades.",
    icon:  FileText,
    color: "text-blue-600",
    bg:    "bg-blue-50",
  },
  {
    id:    "academic",
    title: "Academic Performance Report",
    desc:  "CGPA, grade distribution, and overall semester performance summary.",
    icon:  TrendingUp,
    color: "text-indigo-600",
    bg:    "bg-indigo-50",
  },
  {
    id:       "university",
    title:    "University Result Report",
    desc:     "Official university mark sheets and arrear status — synced from the university portal.",
    icon:     BarChart2,
    color:    "text-violet-600",
    bg:       "bg-violet-50",
    disabled: true,
  },
] as const;

// ── Component ──────────────────────────────────────────────────────────────────
export function StudentReports() {
  const { isDark } = useTheme();
  const [statuses, setStatuses]   = useState<Record<string, Status>>({});
  const [history, setHistory]     = useState<{ name: string; date: string; rows: number }[]>([]);

  const setStatus = (id: string, s: Status) =>
    setStatuses(prev => ({ ...prev, [id]: s }));

  // ── Download handlers ──────────────────────────────────────────────────────
  const handleAttendance = async () => {
    const res = await attendanceApi.getMySummary();
    const data: AttendanceSummary[] = res.data;
    const rows = data.map(a => [
      a.subject_code,
      a.subject_name,
      String(a.attended),
      String(a.total_classes),
      `${a.percentage.toFixed(1)}%`,
      a.percentage >= 75 ? "Eligible" : "Shortage",
    ]);
    const filename = `Attendance_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCSVDownload(filename, ["Subject Code", "Subject Name", "Attended", "Total", "Percentage", "Status"], rows);
    return { filename, rows: rows.length };
  };

  const handleMarks = async () => {
    const res  = await marksApi.getMyMarks();
    const data: MarkOut[] = res.data;
    const rows = data.map(m => [
      m.subject_id.slice(0, 10).toUpperCase(),
      m.exam_type,
      String(m.marks_obtained),
      String(m.max_marks),
      m.grade ?? "—",
      m.remarks ?? "—",
    ]);
    const filename = `Marks_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCSVDownload(filename, ["Subject", "Exam Type", "Obtained", "Max", "Grade", "Remarks"], rows);
    return { filename, rows: rows.length };
  };

  const handleAcademic = async () => {
    const [mRes, cRes] = await Promise.all([marksApi.getMyMarks(), marksApi.getMyCGPA()]);
    const cgpa = cRes.data as CGPASummary;
    const rows: string[][] = (mRes.data as MarkOut[]).map(m => [
      m.subject_id.slice(0, 10).toUpperCase(),
      m.exam_type,
      String(m.marks_obtained),
      String(m.max_marks),
      m.grade ?? "—",
    ]);
    // Append CGPA summary at the bottom
    rows.push([], ["CGPA Summary", "", "", "", ""]);
    rows.push(["CGPA", cgpa.cgpa.toFixed(2), "Total Subjects", String(cgpa.total_subjects), ""]);
    Object.entries(cgpa.grade_breakdown).forEach(([g, c]) =>
      rows.push([`Grade ${g}`, String(c), "subjects", "", ""])
    );
    const filename = `Academic_Performance_${new Date().toISOString().slice(0, 10)}.csv`;
    triggerCSVDownload(filename, ["Subject", "Exam Type", "Obtained", "Max", "Grade"], rows);
    return { filename, rows: rows.length };
  };

  const downloadMap: Record<string, () => Promise<{ filename: string; rows: number }>> = {
    attendance: handleAttendance,
    marks:      handleMarks,
    academic:   handleAcademic,
  };

  const onDownload = async (id: string) => {
    setStatus(id, "loading");
    try {
      const result = await downloadMap[id]();
      setStatus(id, "done");
      setHistory(h => [{ name: result.filename, date: new Date().toLocaleString(), rows: result.rows }, ...h].slice(0, 10));
      setTimeout(() => setStatus(id, "idle"), 3000);
    } catch {
      setStatus(id, "error");
      setTimeout(() => setStatus(id, "idle"), 3000);
    }
  };

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card   = isDark ? "#1e293b" : "#ffffff";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const hoverBg = isDark ? "#0f172a"  : "#f8fafc";

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Info banner */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{
          backgroundColor: isDark ? "rgba(79,70,229,0.1)" : "#eef2ff",
          border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "#c7d2fe"}`,
        }}>
        <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#a5b4fc" : "#4338ca" }}>Academic Reports</p>
          <p style={{ fontSize: 12, marginTop: 3, color: isDark ? "#818cf8" : "#6366f1" }}>
            Download your academic reports as CSV files generated live from your records. University results require backend sync.
          </p>
        </div>
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reportDefs.map(r => {
          const status   = statuses[r.id] ?? "idle";
          const disabled = "disabled" in r && r.disabled;
          return (
            <div
              key={r.id}
              className="rounded-2xl p-5 transition-shadow hover:shadow-md"
              style={{
                backgroundColor: card,
                border: `1px solid ${border}`,
                opacity: disabled ? 0.6 : 1,
              }}
            >
              <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center mb-4`}>
                <r.icon className={`w-5 h-5 ${r.color}`} />
              </div>

              <h3 style={{ fontSize: 13, fontWeight: 700, color: textPri }}>{r.title}</h3>
              <p style={{ fontSize: 12, marginTop: 6, lineHeight: 1.6, color: textSub }}>{r.desc}</p>

              <div className="flex items-center justify-between mt-4">
                <span style={{ fontSize: 11, color: textSub }}>
                  {disabled ? "Coming soon" : "Live • CSV"}
                </span>

                <button
                  id={`download-${r.id}-btn`}
                  onClick={() => !disabled && status === "idle" && onDownload(r.id)}
                  disabled={disabled || status === "loading"}
                  className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition-colors"
                  style={{
                    fontWeight: 500,
                    cursor: disabled || status === "loading" ? "not-allowed" : "pointer",
                    backgroundColor:
                      disabled           ? (isDark ? "#1e293b" : "#f1f5f9") :
                      status === "done"  ? "#f0fdf4"           :
                      status === "error" ? "#fef2f2"           :
                      status === "loading" ? (isDark ? "#1e293b" : "#f1f5f9") :
                      "#4f46e5",
                    color:
                      disabled           ? (isDark ? "#475569" : "#94a3b8") :
                      status === "done"  ? "#16a34a"           :
                      status === "error" ? "#dc2626"           :
                      status === "loading" ? (isDark ? "#64748b" : "#94a3b8") :
                      "#ffffff",
                  }}
                >
                  {status === "done"    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Downloaded</> :
                   status === "error"   ? <><RefreshCw    className="w-3.5 h-3.5" /> Retry</> :
                   status === "loading" ? <><Loader2      className="w-3.5 h-3.5 animate-spin" /> Generating…</> :
                   disabled             ? "Coming Soon" :
                                         <><Download     className="w-3.5 h-3.5" /> Download CSV</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download history */}
      <div className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
          <h3 style={{ fontWeight: 600, fontSize: 14, color: textPri }}>Download History</h3>
        </div>
        <div>
          {history.length === 0 ? (
            <p style={{ padding: "16px 20px", fontSize: 12, color: textSub }}>
              No downloads yet in this session. Click a report card above to generate and download your CSV.
            </p>
          ) : (
            history.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 transition-colors"
                style={{ padding: "12px 20px", borderTop: i > 0 ? `1px solid ${border}` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: 12, fontWeight: 500, color: textPri }}>{f.name}</p>
                  <p style={{ fontSize: 11, color: textSub }}>{f.date} · {f.rows} rows</p>
                </div>
                <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
