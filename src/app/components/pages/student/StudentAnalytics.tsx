import { useEffect, useState } from "react";
import { TrendingUp, Award, BarChart2, Users, Loader2, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { marksApi, attendanceApi, MarkOut, AttendanceSummary, CGPASummary } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const GRADE_COLORS: Record<string, string> = {
  O: "#22c55e", "A+": "#8b5cf6", A: "#4f46e5",
  "B+": "#f97316", B: "#f59e0b", C: "#64748b", F: "#ef4444",
};

export function StudentAnalytics() {
  const { isDark } = useTheme();
  const [marks, setMarks]           = useState<MarkOut[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [cgpa, setCgpa]             = useState<CGPASummary | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([marksApi.getMyMarks(), marksApi.getMyCGPA(), attendanceApi.getMySummary()])
      .then(([mRes, cRes, aRes]) => {
        setMarks(mRes.data);
        setCgpa(cRes.data);
        setAttendance(aRes.data);
        setError("");
      })
      .catch(() => setError("Could not load analytics. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // ── Themed tokens ────────────────────────────────────────────────────────────
  const card       = isDark ? "#1e293b" : "#ffffff";
  const border     = isDark ? "#334155" : "#f1f5f9";
  const textPri    = isDark ? "#f1f5f9" : "#1e293b";
  const textSub    = isDark ? "#64748b" : "#94a3b8";
  const textMed    = isDark ? "#94a3b8" : "#475569";
  const gridColor  = isDark ? "#334155" : "#f1f5f9";
  const barTrack   = isDark ? "#334155" : "#f1f5f9";
  const tooltipStyle = { background: "#1e293b", border: "none", borderRadius: 10, color: "#f8fafc", fontSize: 12 };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const subjectMap: Record<string, { code: string; total: number; max: number; count: number }> = {};
  marks.forEach(m => {
    if (!subjectMap[m.subject_id])
      subjectMap[m.subject_id] = { code: m.subject_id.slice(0, 6).toUpperCase(), total: 0, max: 0, count: 0 };
    subjectMap[m.subject_id].total += m.marks_obtained;
    subjectMap[m.subject_id].max   += m.max_marks;
    subjectMap[m.subject_id].count += 1;
  });

  const subjectMarks = Object.entries(subjectMap)
    .map(([, s]) => ({ sub: s.code, score: Math.round((s.total / s.max) * 100), max: 100 }))
    .slice(0, 6);

  const radarData    = subjectMarks.map(s => ({ subject: s.sub, score: s.score }));
  const gradeBreakdown = cgpa
    ? Object.entries(cgpa.grade_breakdown).map(([grade, count]) => ({ range: grade, count, label: grade }))
    : [];
  const attendanceChart = attendance.map(a => ({ sub: a.subject_code, pct: Math.round(a.percentage) }));
  const overallAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((acc, a) => acc + a.percentage, 0) / attendance.length)
    : 0;
  const eligible      = attendance.filter(a => a.percentage >= 75).length;
  const currentCgpa   = cgpa?.cgpa?.toFixed(2) ?? "—";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
      <span className="text-sm" style={{ color: textSub }}>Loading analytics…</span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      {/* ── Header stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Current CGPA",      value: currentCgpa,                          sub: `${cgpa?.total_subjects ?? 0} subjects`,    icon: Award,     bg: "bg-blue-50",    color: "text-blue-600"   },
          { label: "Avg Attendance",     value: `${overallAttendance}%`,              sub: `${attendance.length} subjects`,            icon: TrendingUp, bg: "bg-violet-50",  color: "text-violet-600" },
          { label: "Eligible Subjects",  value: `${eligible}/${attendance.length}`,  sub: "≥ 75% attendance",                         icon: BarChart2,  bg: "bg-emerald-50", color: "text-emerald-600"},
          { label: "Total Assessments",  value: marks.length.toString(),              sub: "Marks recorded",                           icon: Users,      bg: "bg-orange-50",  color: "text-orange-500" },
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

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance per subject */}
        <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: textPri }}>Attendance by Subject</h3>
              <p className="text-xs" style={{ color: textSub }}>75% threshold</p>
            </div>
          </div>
          {attendanceChart.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: textSub }}>No attendance data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceChart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="sub" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Attendance"]} />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {attendanceChart.map((a, i) => <Cell key={i} fill={a.pct >= 75 ? "#4f46e5" : "#ef4444"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-indigo-600" />
              <span className="text-xs" style={{ color: textSub }}>Eligible (≥75%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-xs" style={{ color: textSub }}>At risk (&lt;75%)</span>
            </div>
          </div>
        </div>

        {/* Marks by subject */}
        <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: textPri }}>Marks by Subject</h3>
              <p className="text-xs" style={{ color: textSub }}>Normalised to 100</p>
            </div>
          </div>
          {subjectMarks.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: textSub }}>No marks recorded yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={subjectMarks} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="sub" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Score"]} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {subjectMarks.map((s, i) => (
                      <Cell key={i} fill={s.score >= 80 ? "#8b5cf6" : s.score >= 60 ? "#f97316" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {subjectMarks.map(s => (
                  <div key={s.sub} className="flex items-center gap-3">
                    <span className="text-xs w-10" style={{ color: textSub }}>{s.sub}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: barTrack }}>
                      <div className={`h-full rounded-full ${s.score >= 80 ? "bg-violet-500" : s.score >= 60 ? "bg-orange-500" : "bg-red-500"}`}
                        style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-xs w-8 text-right" style={{ fontWeight: 600, color: textMed }}>{s.score}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Grade breakdown + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: textPri }}>Grade Distribution</h3>
              <p className="text-xs" style={{ color: textSub }}>Your grades across all assessments</p>
            </div>
          </div>
          {gradeBreakdown.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: textSub }}>No grades recorded yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={gradeBreakdown} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} subjects`, "Count"]} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {gradeBreakdown.map((g, i) => <Cell key={i} fill={GRADE_COLORS[g.label] ?? "#94a3b8"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 p-3 rounded-xl"
                style={{ backgroundColor: isDark ? "rgba(79,70,229,0.12)" : "#eef2ff", border: `1px solid ${isDark ? "rgba(99,102,241,0.3)" : "#c7d2fe"}` }}>
                <p className="text-xs" style={{ fontWeight: 600, color: isDark ? "#a5b4fc" : "#4338ca" }}>📍 CGPA Summary</p>
                <p className="text-xs mt-1" style={{ color: isDark ? "#818cf8" : "#6366f1" }}>
                  Current CGPA: <strong>{currentCgpa}</strong> across {cgpa?.total_subjects ?? 0} subjects.
                  {Number(currentCgpa) >= 8 ? " 🎉 Excellent performance!" : Number(currentCgpa) >= 6.5 ? " Keep it up!" : " Focus on weaker subjects."}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl p-5 hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 style={{ fontWeight: 600, color: textPri }}>Skill Coverage Radar</h3>
              <p className="text-xs" style={{ color: textSub }}>Subject-wise performance overview</p>
            </div>
          </div>
          {radarData.length === 0 ? (
            <p className="text-sm text-center py-20" style={{ color: textSub }}>Submit assessments to see your radar chart</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: isDark ? "#64748b" : "#64748b" }} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
