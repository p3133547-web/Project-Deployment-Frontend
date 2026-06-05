import { useState, useEffect } from "react";
import { Save, Check, BookOpen, Search, Loader2, AlertCircle } from "lucide-react";
import { marksApi, attendanceApi, usersApi, SubjectOut, UserOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const EXAM_TYPES = [
  { key: "ct1",        label: "CT1",          max: 25  },
  { key: "ct2",        label: "CT2",          max: 25  },
  { key: "assignment", label: "Assignment",   max: 10  },
  { key: "practical",  label: "Practical",    max: 20  },
  { key: "semester",   label: "Semester Exam",max: 100 },
];

export function StaffMarks() {
  const { isDark } = useTheme();
  const [subjects, setSubjects]           = useState<SubjectOut[]>([]);
  const [students, setStudents]           = useState<UserOut[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExam, setSelectedExam]   = useState("ct1");
  const [search, setSearch]               = useState("");
  const [marks, setMarks]                 = useState<Record<string, number | null>>({});
  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card     = isDark ? "#1e293b" : "#ffffff";
  const border   = isDark ? "#334155" : "#f1f5f9";
  const textPri  = isDark ? "#f1f5f9" : "#1e293b";
  const textSub  = isDark ? "#64748b" : "#94a3b8";
  const textMed  = isDark ? "#94a3b8" : "#475569";
  const inputBg  = isDark ? "#0f172a"  : "#f8fafc";
  const tableHead= isDark ? "#0f172a"  : "#f8fafc";
  const hoverBg  = isDark ? "#0f172a"  : "#f8fafc";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      attendanceApi.getSubjects({ department: "Computer Science" }),
      usersApi.listStudents("Computer Science"),
    ])
      .then(([subjRes, studRes]) => {
        setSubjects(subjRes.data);
        setStudents(studRes.data);
        if (subjRes.data.length > 0) setSelectedSubjectId(subjRes.data[0].id);
        const initial: Record<string, number | null> = {};
        studRes.data.forEach(s => { initial[s.id] = null; });
        setMarks(initial);
        setError("");
      })
      .catch(() => setError("Could not load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const examConfig   = EXAM_TYPES.find(e => e.key === selectedExam) ?? EXAM_TYPES[0];
  const maxMark      = examConfig.max;
  const updateMark   = (studentId: string, val: string) => {
    const n = val === "" ? null : Math.min(maxMark, Math.max(0, Number(val)));
    setMarks(prev => ({ ...prev, [studentId]: n }));
    setSaved(false);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_no ?? s.employee_id).toLowerCase().includes(search.toLowerCase())
  );

  const enteredValues = Object.values(marks).filter(v => v !== null) as number[];
  const avg     = enteredValues.length > 0 ? enteredValues.reduce((a, b) => a + b, 0) / enteredValues.length : 0;
  const highest = enteredValues.length > 0 ? Math.max(...enteredValues) : 0;
  const lowest  = enteredValues.length > 0 ? Math.min(...enteredValues) : 0;

  const handleSave = async () => {
    if (!selectedSubjectId) return;
    setSaving(true);
    try {
      const entries = students
        .filter(s => marks[s.id] !== null)
        .map(s => ({ student_id: s.id, marks_obtained: marks[s.id] as number, remarks: undefined }));
      if (entries.length === 0) { setSaving(false); return; }
      await marksApi.enterMarksBulk({ subject_id: selectedSubjectId, exam_type: selectedExam, max_marks: maxMark, entries });
      setSaved(true);
    } catch { setError("Failed to save marks. Please try again."); }
    finally { setSaving(false); }
  };

  const selectedSubjectLabel = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-sm" style={{ color: textSub }}>Loading students & subjects…</span>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Students",     value: students.length.toString(),           bg: "bg-slate-100",  color: "text-slate-700"  },
              { label: "Class Average",value: `${avg.toFixed(1)}/${maxMark}`,       bg: "bg-blue-50",    color: "text-blue-600"   },
              { label: "Highest",      value: highest.toString(),                   bg: "bg-emerald-50", color: "text-emerald-600" },
              { label: "Lowest",       value: enteredValues.length > 0 ? lowest.toString() : "—", bg: "bg-red-50", color: "text-red-600" },
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
                <select value={selectedSubjectId} onChange={e => { setSelectedSubjectId(e.target.value); setSaved(false); }}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code} – {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Exam Type</label>
                <select value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setSaved(false); }}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {EXAM_TYPES.map(e => <option key={e.key} value={e.key}>{e.label} (/{e.max})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Search Student</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: textSub }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or roll no…"
                    className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
                    style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
                </div>
              </div>
            </div>
          </div>

          {/* Marks table */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, color: textPri }}>{examConfig.label} Marks Entry</h3>
                  <p className="text-xs" style={{ color: textSub }}>
                    {selectedSubjectLabel ? `${selectedSubjectLabel.code} – ${selectedSubjectLabel.name}` : ""} · Max: {maxMark} · {filtered.length} students
                  </p>
                </div>
              </div>
              <button onClick={handleSave} disabled={saving || saved}
                className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-70 ${saved ? "bg-emerald-50 text-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                style={{ fontWeight: 500 }}>
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : saved ? <><Check className="w-4 h-4" /> Saved to DB!</>
                  : <><Save className="w-4 h-4" /> Save Marks</>}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: tableHead, borderBottom: `1px solid ${border}` }}>
                    <th className="px-4 py-3 text-left text-xs w-8" style={{ fontWeight: 600, color: textSub }}>#</th>
                    <th className="px-4 py-3 text-left text-xs" style={{ fontWeight: 600, color: textSub }}>Roll No.</th>
                    <th className="px-4 py-3 text-left text-xs" style={{ fontWeight: 600, color: textSub }}>Student Name</th>
                    <th className="px-4 py-3 text-center text-xs text-indigo-600" style={{ fontWeight: 700 }}>{examConfig.label} /{maxMark}</th>
                    <th className="px-4 py-3 text-center text-xs" style={{ fontWeight: 600, color: textSub }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const val = marks[s.id];
                    const pct = val !== null && val !== undefined ? Math.round((val / maxMark) * 100) : null;
                    return (
                      <tr key={s.id} style={{ borderTop: `1px solid ${border}` }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <td className="px-4 py-3 text-sm" style={{ color: textSub }}>{i + 1}</td>
                        <td className="px-4 py-3 text-xs" style={{ fontWeight: 500, color: textMed }}>{s.roll_no ?? s.employee_id}</td>
                        <td className="px-4 py-3 text-sm" style={{ fontWeight: 500, color: textMed }}>{s.name}</td>
                        <td className="px-4 py-3 text-center">
                          <input type="number" min={0} max={maxMark}
                            value={val ?? ""}
                            onChange={e => updateMark(s.id, e.target.value)}
                            placeholder="—"
                            className="w-16 text-center rounded-lg py-1.5 text-sm outline-none transition-all bg-indigo-50 border border-indigo-200 text-indigo-700 focus:ring-2 focus:ring-indigo-100"
                            style={{ fontWeight: 600 }} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          {pct !== null ? (
                            <span className={`text-xs px-2 py-0.5 rounded ${pct >= 80 ? "bg-emerald-50 text-emerald-700" : pct >= 50 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}
                              style={{ fontWeight: 600 }}>{pct}%</span>
                          ) : <span className="text-xs" style={{ color: textSub }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
