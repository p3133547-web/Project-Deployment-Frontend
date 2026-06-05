import { useState, useEffect } from "react";
import { Download, CheckCircle2, AlertCircle, BookOpen, Printer, QrCode, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { attendanceApi, AttendanceSummary } from "@/lib/api";

const EXAM_SCHEDULE = [
  { date: "May 5",  day: "Mon", slot: "9:00 AM – 12:00 PM" },
  { date: "May 8",  day: "Thu", slot: "9:00 AM – 12:00 PM" },
  { date: "May 12", day: "Mon", slot: "9:00 AM – 12:00 PM" },
  { date: "May 15", day: "Thu", slot: "9:00 AM – 12:00 PM" },
  { date: "May 19", day: "Mon", slot: "9:00 AM – 12:00 PM" },
];

export function StudentHallTicket() {
  const { user }   = useAuth();
  const { isDark } = useTheme();
  const [subjects, setSubjects]   = useState<AttendanceSummary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    attendanceApi.getMySummary()
      .then(res => { setSubjects(res.data); setError(""); })
      .catch(() => setError("Could not load attendance. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const hoverBg = isDark ? "#0f172a"  : "#f8fafc";

  const allEligible = subjects.length > 0 && subjects.every(s => s.percentage >= 75);
  const ineligible  = subjects.filter(s => s.percentage < 75);
  const schedule    = subjects.map((s, i) => ({
    subject: s.subject_name,
    code:    s.subject_code,
    date:    EXAM_SCHEDULE[i % EXAM_SCHEDULE.length]?.date ?? "TBD",
    day:     EXAM_SCHEDULE[i % EXAM_SCHEDULE.length]?.day  ?? "",
    slot:    "9:00 AM – 12:00 PM",
  }));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto">
      {/* Status banner */}
      <div className={`rounded-2xl p-5 text-white shadow-lg ${
        loading               ? "bg-gradient-to-r from-slate-500 to-slate-600" :
        allEligible           ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-100" :
        subjects.length === 0 ? "bg-gradient-to-r from-slate-500 to-slate-600" :
                                "bg-gradient-to-r from-amber-500 to-orange-500 shadow-orange-100"
      }`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> :
             allEligible ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-white/80 text-sm">End Semester Examination – Spring 2026</p>
            <h2 className="text-white mt-0.5" style={{ fontSize: 20, fontWeight: 700 }}>
              {loading ? "Checking eligibility…" :
               subjects.length === 0 ? "No attendance records found" :
               allEligible ? "Eligible for All Examinations ✓" :
               `${ineligible.length} subject(s) require action`}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {subjects.length} subjects · May 5 – May 22, 2026 · {allEligible && subjects.length > 0 ? "Hall ticket ready" : "Check eligibility below"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Subject eligibility */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: textPri }}>Subject Eligibility</h3>
                <p className="text-xs" style={{ color: textSub }}>Minimum 75% attendance required</p>
              </div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading attendance…</span>
              </div>
            ) : subjects.length === 0 ? (
              <p className="text-center text-sm py-10" style={{ color: textSub }}>No attendance records found. Contact your class advisor.</p>
            ) : (
              <div>
                {subjects.map((s, idx) => {
                  const eligible = s.percentage >= 75;
                  return (
                    <div key={s.subject_id}
                      className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                      style={{ borderTop: idx > 0 ? `1px solid ${border}` : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${eligible ? "bg-emerald-500" : "bg-red-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm" style={{ fontWeight: 500, color: textPri }}>{s.subject_name}</p>
                        <p className="text-xs" style={{ color: textSub }}>{s.subject_code} · {s.attended}/{s.total_classes} classes ({s.percentage.toFixed(1)}%)</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-16 h-1.5 rounded-full hidden sm:block" style={{ backgroundColor: isDark ? "#334155" : "#f1f5f9" }}>
                          <div className={`h-full rounded-full ${eligible ? "bg-emerald-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(s.percentage, 100)}%` }} />
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-lg ${eligible ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                          style={{ fontWeight: 600 }}>
                          {eligible ? "Eligible" : "Ineligible"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Exam schedule */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <h3 style={{ fontWeight: 600, color: textPri }}>Exam Schedule</h3>
              <p className="text-xs" style={{ color: textSub }}>Spring 2026 · Main Campus</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 text-indigo-500 animate-spin" /></div>
            ) : schedule.length === 0 ? (
              <p className="text-center text-sm py-8" style={{ color: textSub }}>Schedule will be published once attendance is recorded</p>
            ) : (
              <div>
                {schedule.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 transition-colors"
                    style={{ borderTop: i > 0 ? `1px solid ${border}` : "none" }}
                    onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = hoverBg)}
                    onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = "transparent")}>
                    <div className="text-center w-12 flex-shrink-0">
                      <p className="text-sm" style={{ fontWeight: 700, color: textPri }}>{e.date}</p>
                      <p className="text-xs" style={{ color: textSub }}>{e.day}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ fontWeight: 500, color: textMed }}>{e.subject}</p>
                      <p className="text-xs" style={{ color: textSub }}>{e.code} · {e.slot}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: details + download ── */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 space-y-3.5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <h3 style={{ fontWeight: 600, color: textPri }}>Exam Details</h3>
            {[
              { label: "Registration Deadline", value: "Apr 25, 2026" },
              { label: "Fee Amount",            value: "₹1,500 (Paid)" },
              { label: "Exam Center",           value: "Main Campus" },
              { label: "Slot",                  value: "9 AM – 12 PM" },
              { label: "Total Subjects",        value: loading ? "…" : subjects.length.toString() },
              { label: "Eligible",              value: loading ? "…" : `${subjects.filter(s => s.percentage >= 75).length}/${subjects.length}` },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-start gap-2">
                <p className="text-xs" style={{ color: textSub }}>{item.label}</p>
                <p className="text-xs text-right" style={{ fontWeight: 500, color: textMed }}>{item.value}</p>
              </div>
            ))}
          </div>

          {!loading && subjects.length > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
              <div className="rounded-xl p-4 text-center mb-4"
                style={{ backgroundColor: isDark ? "rgba(79,70,229,0.12)" : "#eef2ff" }}>
                <div className="w-16 h-16 rounded-xl mx-auto flex items-center justify-center shadow-sm mb-2"
                  style={{ backgroundColor: card }}>
                  <QrCode className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-indigo-600 text-xs" style={{ fontWeight: 700 }}>{user?.rollNo ?? "Roll No."}</p>
                <p className="text-xs mt-0.5" style={{ color: textMed }}>{user?.name}</p>
                <p className="text-xs mt-0.5" style={{ color: textSub }}>
                  {user?.department} · {user?.year ? `Year ${user.year}` : ""}
                  {user?.section ? ` · Section ${user.section}` : ""}
                </p>
              </div>

              {!allEligible && ineligible.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-3">
                  <p className="text-red-600 text-xs" style={{ fontWeight: 600 }}>⚠ Hall ticket restricted</p>
                  <p className="text-red-500 text-xs mt-0.5">{ineligible.map(s => s.subject_code).join(", ")} — attendance below 75%</p>
                </div>
              )}

              <button
                onClick={() => allEligible && setDownloaded(true)}
                disabled={!allEligible}
                className={`w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl transition-colors ${
                  downloaded  ? "bg-emerald-50 text-emerald-600" :
                  allEligible ? "bg-indigo-600 text-white hover:bg-indigo-700" :
                                "text-slate-400 cursor-not-allowed"}`}
                style={{ fontWeight: 500, backgroundColor: (!allEligible && !downloaded) ? (isDark ? "#1e293b" : "#f1f5f9") : undefined }}>
                {downloaded
                  ? <><CheckCircle2 className="w-4 h-4" /> Downloaded</>
                  : <><Download className="w-4 h-4" /> Download Hall Ticket</>}
              </button>
              {downloaded && (
                <button className="w-full flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl transition-colors mt-2"
                  style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc", color: textMed, fontWeight: 500 }}>
                  <Printer className="w-4 h-4" /> Print
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
