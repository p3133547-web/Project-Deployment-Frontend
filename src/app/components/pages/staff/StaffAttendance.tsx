import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Save, Users, Check, Loader2, AlertCircle } from "lucide-react";
import { attendanceApi, usersApi, SubjectOut, UserOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

type Status = "present" | "absent" | "od";
const STATUS_MAP: Record<"P" | "A" | "OD", Status> = { P: "present", A: "absent", OD: "od" };
const DISPLAY: Record<Status, "P" | "A" | "OD"> = { present: "P", absent: "A", od: "OD" };

export function StaffAttendance() {
  const { isDark } = useTheme();
  const [subjects, setSubjects]           = useState<SubjectOut[]>([]);
  const [students, setStudents]           = useState<UserOut[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [date, setDate]       = useState(new Date().toISOString().slice(0, 10));
  const [period, setPeriod]   = useState(1);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError]     = useState("");

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card     = isDark ? "#1e293b" : "#ffffff";
  const border   = isDark ? "#334155" : "#f1f5f9";
  const textPri  = isDark ? "#f1f5f9" : "#1e293b";
  const textSub  = isDark ? "#64748b" : "#94a3b8";
  const textMed  = isDark ? "#94a3b8" : "#475569";
  const inputBg  = isDark ? "#0f172a"  : "#f8fafc";
  const hoverBg  = isDark ? "#0f172a"  : "#f8fafc";

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      attendanceApi.getSubjects({ department: "Computer Science" }),
      usersApi.listStudents("Computer Science"),
    ])
      .then(([subjRes, studRes]) => {
        setSubjects(subjRes.data);
        setStudents(studRes.data);
        if (subjRes.data.length > 0) setSelectedSubjectId(subjRes.data[0].id);
        const initial: Record<string, Status> = {};
        studRes.data.forEach((s) => { initial[s.id] = "present"; });
        setAttendance(initial);
        setError("");
      })
      .catch(() => setError("Could not load data. Is the backend running?"))
      .finally(() => setLoadingData(false));
  }, []);

  const set = (studentId: string, status: Status) => { setAttendance(a => ({ ...a, [studentId]: status })); setSaved(false); };
  const setAll = (status: Status) => {
    const all: Record<string, Status> = {};
    students.forEach((s) => { all[s.id] = status; });
    setAttendance(all);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!selectedSubjectId || students.length === 0) return;
    setSaving(true);
    try {
      await attendanceApi.markBulk({
        subject_id: selectedSubjectId, date, period,
        entries: students.map((s) => ({ student_id: s.id, status: attendance[s.id] ?? "present" })),
      });
      setSaved(true);
    } catch { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  const present = Object.values(attendance).filter(v => v === "present").length;
  const absent  = Object.values(attendance).filter(v => v === "absent").length;
  const od      = Object.values(attendance).filter(v => v === "od").length;
  const pct     = students.length > 0 ? Math.round((present / students.length) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-sm" style={{ color: textSub }}>Loading class data…</span>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total",        value: students.length, bg: "bg-slate-100",  color: "text-slate-700"  },
              { label: "Present",      value: present,         bg: "bg-emerald-50", color: "text-emerald-600" },
              { label: "Absent",       value: absent,          bg: "bg-red-50",     color: "text-red-600"    },
              { label: "Attendance %", value: `${pct}%`,
                bg: pct >= 75 ? "bg-emerald-50" : "bg-orange-50",
                color: pct >= 75 ? "text-emerald-600" : "text-orange-500" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4`} style={{ border: `1px solid ${border}` }}>
                <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</p>
                <p className={`text-sm ${s.color} opacity-80`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Subject</label>
                <select value={selectedSubjectId}
                  onChange={(e) => { setSelectedSubjectId(e.target.value); setSaved(false); }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code} – {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Date</label>
                <input type="date" value={date}
                  onChange={(e) => { setDate(e.target.value); setSaved(false); }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Period</label>
                <select value={period}
                  onChange={(e) => { setPeriod(Number(e.target.value)); setSaved(false); }}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {[1, 2, 3, 4, 5, 6, 7].map(p => <option key={p} value={p}>Period {p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${border}` }}>
              <span className="text-xs" style={{ fontWeight: 500, color: textSub }}>Mark all as:</span>
              {(["P", "A", "OD"] as const).map(s => (
                <button key={s} onClick={() => setAll(STATUS_MAP[s])}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors ${s === "P" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : s === "A" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
                  style={{ fontWeight: 500 }}>
                  {s === "P" ? <CheckCircle2 className="w-3.5 h-3.5" /> : s === "A" ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {s === "P" ? "Present" : s === "A" ? "Absent" : "On Duty"}
                </button>
              ))}
            </div>
          </div>

          {/* Student list */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, color: textPri }}>Student List</h3>
                  <p className="text-xs" style={{ color: textSub }}>{students.length} students · {date}</p>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving || saved}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-70 ${saved ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                style={{ fontWeight: 500 }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : saved ? <><Check className="w-4 h-4" /> Saved to DB!</>
                  : <><Save className="w-4 h-4" /> Save Attendance</>}
              </button>
            </div>
            {students.length === 0 && !error && (
              <p className="text-sm text-center py-12" style={{ color: textSub }}>No students found in Computer Science department.</p>
            )}
            <div>
              {students.map((s, i) => {
                const status = attendance[s.id] ?? "present";
                return (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{
                      borderTop: i > 0 ? `1px solid ${border}` : "none",
                      backgroundColor:
                        status === "absent" ? (isDark ? "rgba(239,68,68,0.08)" : "#fff5f5") :
                        status === "od"     ? (isDark ? "rgba(59,130,246,0.08)" : "#eff6ff") :
                        "transparent",
                    }}
                    onMouseEnter={e => { if (status === "present") e.currentTarget.style.backgroundColor = hoverBg; }}
                    onMouseLeave={e => { if (status === "present") e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <span className="text-sm w-5 flex-shrink-0" style={{ color: textSub }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ fontWeight: 500, color: textMed }}>{s.name}</p>
                      <p className="text-xs" style={{ color: textSub }}>{s.roll_no ?? s.employee_id}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(["P", "A", "OD"] as const).map(st => (
                        <button key={st} onClick={() => set(s.id, STATUS_MAP[st])}
                          className={`px-3 py-1.5 rounded-xl text-xs border-2 transition-all ${DISPLAY[status] === st
                            ? st === "P" ? "bg-emerald-500 text-white border-emerald-500"
                              : st === "A" ? "bg-red-500 text-white border-red-500"
                              : "bg-blue-500 text-white border-blue-500"
                            : "text-slate-400 border-slate-200 hover:border-slate-300"}`}
                          style={{ fontWeight: 600, backgroundColor: DISPLAY[status] !== st ? (isDark ? "#1e293b" : "#ffffff") : undefined }}>
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
