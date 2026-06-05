import { useState, useEffect } from "react";
import { Award, TrendingUp, BookOpen, Star, Loader2, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { marksApi, MarkOut, CGPASummary } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const cgpaHistory = [
  { sem: "Sem 1", cgpa: 7.8 }, { sem: "Sem 2", cgpa: 8.1 },
  { sem: "Sem 3", cgpa: 8.0 }, { sem: "Sem 4", cgpa: 8.3 },
];

export function StudentMarks() {
  const { isDark }  = useTheme();
  const [tab, setTab] = useState<"internal" | "analytics" | "cgpa">("internal");
  const [marks, setMarks]   = useState<MarkOut[]>([]);
  const [cgpa, setCgpa]     = useState<CGPASummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    Promise.all([marksApi.getMyMarks(), marksApi.getMyCGPA()])
      .then(([marksRes, cgpaRes]) => { setMarks(marksRes.data); setCgpa(cgpaRes.data); setError(""); })
      .catch(() => setError("Could not load marks. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card       = isDark ? "#1e293b" : "#ffffff";
  const border     = isDark ? "#334155" : "#f1f5f9";
  const textPri    = isDark ? "#f1f5f9" : "#1e293b";
  const textSub    = isDark ? "#64748b" : "#94a3b8";
  const textMed    = isDark ? "#94a3b8" : "#475569";
  const barTrack   = isDark ? "#334155" : "#f1f5f9";
  const gridColor  = isDark ? "#334155" : "#f1f5f9";
  const tableHead  = isDark ? "#0f172a"  : "#f8fafc";
  const hoverBg    = isDark ? "#0f172a"  : "#f8fafc";
  const tooltipStyle = { background: "#1e293b", border: "none", borderRadius: 10, color: "#f8fafc", fontSize: 12 };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const bySubject = marks.reduce<Record<string, MarkOut[]>>((acc, m) => {
    if (!acc[m.subject_id]) acc[m.subject_id] = [];
    acc[m.subject_id].push(m);
    return acc;
  }, {});

  const subjectRows = Object.entries(bySubject).map(([subj_id, entries]) => {
    const best = entries.reduce((a, b) => a.marks_obtained > b.marks_obtained ? a : b);
    const pct  = Math.round((best.marks_obtained / best.max_marks) * 100);
    return { subj_id, entries, best, pct };
  });

  const avgPct = subjectRows.length > 0
    ? Math.round(subjectRows.reduce((a, s) => a + s.pct, 0) / subjectRows.length) : 0;

  const radarData = subjectRows.map(s => ({ subject: s.subj_id.slice(0, 6).toUpperCase(), score: s.pct }));
  const cgpaWithCurrent = cgpa ? [...cgpaHistory, { sem: "Sem 5", cgpa: cgpa.cgpa }] : cgpaHistory;

  const gradeChip = (grade: string | undefined) => {
    const map: Record<string, string> = {
      "O": "text-emerald-700 bg-emerald-50 border-emerald-200",
      "A+": "text-emerald-700 bg-emerald-50 border-emerald-200",
      "A": "text-blue-700 bg-blue-50 border-blue-200",
      "B+": "text-violet-700 bg-violet-50 border-violet-200",
      "B": "text-amber-700 bg-amber-50 border-amber-200",
      "C": "text-orange-700 bg-orange-50 border-orange-200",
      "F": "text-red-700 bg-red-50 border-red-200",
    };
    return map[grade ?? ""] ?? "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-sm" style={{ color: textSub }}>Loading marks data…</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Current CGPA",    value: cgpa ? cgpa.cgpa.toFixed(2) : "—", icon: Award,      bg: "bg-blue-50",    color: "text-blue-600",    sub: "Live from records" },
              { label: "Total Subjects",  value: cgpa ? cgpa.total_subjects.toString() : "—", icon: TrendingUp, bg: "bg-violet-50",  color: "text-violet-600",  sub: "With records" },
              { label: "Avg Score",       value: `${avgPct}%`,                          icon: BookOpen,   bg: "bg-orange-50",  color: "text-orange-500",  sub: `Across ${subjectRows.length} subjects` },
              { label: "Top Grade",
                value: cgpa && Object.keys(cgpa.grade_breakdown).length > 0
                  ? Object.entries(cgpa.grade_breakdown).sort(([,a],[,b]) => b - a)[0][0]
                  : "—",
                icon: Star, bg: "bg-emerald-50", color: "text-emerald-600", sub: "Best grade achieved" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 hover:shadow-md transition-shadow"
                style={{ backgroundColor: card, border: `1px solid ${border}` }}>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: textPri }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ fontWeight: 500, color: textMed }}>{s.label}</p>
                <p className="text-xs" style={{ color: textSub }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Tabbed card ── */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            {/* Tab bar */}
            <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
              {(["internal", "analytics", "cgpa"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="flex-1 py-3.5 text-sm transition-colors"
                  style={{
                    fontWeight: tab === t ? 600 : 400,
                    color: tab === t ? "#4f46e5" : textSub,
                    backgroundColor: tab === t ? (isDark ? "rgba(79,70,229,0.1)" : "#eef2ff") : "transparent",
                    borderBottom: tab === t ? "2px solid #4f46e5" : "2px solid transparent",
                  }}>
                  {t === "internal" ? "Marks Records" : t === "analytics" ? "Performance Chart" : "CGPA Overview"}
                </button>
              ))}
            </div>

            {/* ── Internal marks table ── */}
            {tab === "internal" && (
              <div className="overflow-x-auto">
                {marks.length === 0 && !error ? (
                  <p className="text-sm text-center py-14" style={{ color: textSub }}>
                    No marks entered yet. Staff will update after each exam.
                  </p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: tableHead, borderBottom: `1px solid ${border}` }}>
                        {["Subject ID", "Exam Type", "Obtained", "Max", "Grade"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs whitespace-nowrap"
                            style={{ fontWeight: 600, color: textSub }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map(m => (
                        <tr key={m.id}
                          style={{ borderTop: `1px solid ${border}` }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                          <td className="px-4 py-3.5">
                            <p className="text-sm" style={{ fontWeight: 500, color: textPri }}>{m.subject_id.slice(0, 8)}</p>
                          </td>
                          <td className="px-4 py-3.5 text-sm capitalize" style={{ color: textMed }}>{m.exam_type.replace("_", " ")}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-sm font-semibold ${(m.marks_obtained / m.max_marks) >= 0.8 ? "text-emerald-600" : (m.marks_obtained / m.max_marks) >= 0.6 ? "text-amber-600" : "text-red-600"}`}>
                              {m.marks_obtained}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: textSub }}>{m.max_marks}</td>
                          <td className="px-4 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-lg border ${gradeChip(m.grade)}`}
                              style={{ fontWeight: 700 }}>
                              {m.grade ?? "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Analytics tab ── */}
            {tab === "analytics" && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Score by Subject (%)</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={subjectRows.map(s => ({ name: s.subj_id.slice(0, 6), score: s.pct }))}
                      margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
                        {subjectRows.map((s, i) => <Cell key={i} fill={s.pct >= 80 ? "#8b5cf6" : s.pct >= 60 ? "#f97316" : "#ef4444"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Skill Radar</p>
                  {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                        <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: isDark ? "#64748b" : "#64748b" }} />
                        <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-center mt-16" style={{ color: textSub }}>No data for radar chart</p>
                  )}
                </div>
              </div>
            )}

            {/* ── CGPA tab ── */}
            {tab === "cgpa" && (
              <div className="p-5">
                <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>CGPA Progression</p>
                <div className="space-y-3 mb-6">
                  {cgpaWithCurrent.map((s, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-sm w-16 flex-shrink-0" style={{ color: textSub }}>{s.sem}</span>
                      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: barTrack }}>
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                          style={{ width: `${(s.cgpa / 10) * 100}%` }} />
                      </div>
                      <span className="text-sm w-10 text-right" style={{ fontWeight: 700, color: textPri }}>{s.cgpa}</span>
                    </div>
                  ))}
                </div>

                {cgpa && Object.keys(cgpa.grade_breakdown).length > 0 && (
                  <div className="rounded-xl p-4"
                    style={{ backgroundColor: isDark ? "rgba(79,70,229,0.1)" : "#eef2ff", border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "#c7d2fe"}` }}>
                    <p className="text-sm mb-3" style={{ fontWeight: 600, color: isDark ? "#a5b4fc" : "#4338ca" }}>Grade Breakdown</p>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(cgpa.grade_breakdown).map(([grade, count]) => (
                        <div key={grade} className="rounded-lg px-4 py-2.5 text-center min-w-[70px]"
                          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
                          <p className="text-sm text-violet-600" style={{ fontWeight: 700 }}>{grade}</p>
                          <p className="text-xs" style={{ color: textSub }}>{count} subject{count > 1 ? "s" : ""}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 rounded-xl p-4"
                  style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc", border: `1px solid ${border}` }}>
                  <p className="text-sm mb-3" style={{ fontWeight: 600, color: textPri }}>Grade Scale Reference</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { grade: "O/A+", points: "10/9", range: "90-100%" },
                      { grade: "A",    points: "8",    range: "80-89%"  },
                      { grade: "B+",   points: "7",    range: "70-79%"  },
                      { grade: "B",    points: "6",    range: "60-69%"  },
                    ].map(g => (
                      <div key={g.grade} className="rounded-lg p-2.5 text-center"
                        style={{ backgroundColor: card, border: `1px solid ${border}` }}>
                        <p className="text-sm text-violet-600" style={{ fontWeight: 700 }}>{g.grade}</p>
                        <p className="text-xs" style={{ color: textMed }}>{g.points} pts</p>
                        <p className="text-xs" style={{ color: textSub }}>{g.range}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
