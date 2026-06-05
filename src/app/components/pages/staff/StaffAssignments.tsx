import { useState, useEffect } from "react";
import { FileText, Upload, CheckCircle2, Clock, Loader2, AlertCircle, Plus, X } from "lucide-react";
import { assignmentsApi, attendanceApi, AssignmentOut, SubjectOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

export function StaffAssignments() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"assignments" | "submissions" | "create">("assignments");
  const [assignments, setAssignments] = useState<AssignmentOut[]>([]);
  const [subjects, setSubjects]       = useState<SubjectOut[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [creating, setCreating]       = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [newTitle, setNewTitle]       = useState("");
  const [newDesc, setNewDesc]         = useState("");
  const [newSubject, setNewSubject]   = useState("");
  const [newDue, setNewDue]           = useState("");
  const [newMaxScore, setNewMaxScore] = useState("10");

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";

  useEffect(() => {
    setLoading(true);
    Promise.all([
      assignmentsApi.getAll(),
      attendanceApi.getSubjects({ department: "Computer Science" }),
    ])
      .then(([asgRes, subjRes]) => {
        setAssignments(asgRes.data);
        setSubjects(subjRes.data);
        if (subjRes.data.length > 0) setNewSubject(subjRes.data[0].id);
        setError("");
      })
      .catch(() => setError("Could not load data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newSubject) return;
    setCreating(true);
    try {
      const res = await assignmentsApi.create({
        title: newTitle, description: newDesc || undefined, subject_id: newSubject,
        due_date: newDue || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        max_marks: newMaxScore ? Number(newMaxScore) : 10,
      });
      setAssignments(prev => [res.data, ...prev]);
      setCreateSuccess(true);
      setNewTitle(""); setNewDesc(""); setNewDue(""); setNewMaxScore("10");
      setTimeout(() => { setCreateSuccess(false); setTab("assignments"); }, 2000);
    } catch { setError("Failed to create assignment. Please try again."); }
    finally { setCreating(false); }
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Assignments", value: loading ? "…" : assignments.length.toString(), icon: FileText,    bg: "bg-violet-50",  color: "text-violet-600",  sub: "Total published"  },
          { label: "Total Submissions",  value: "—",                                            icon: Upload,      bg: "bg-blue-50",    color: "text-blue-600",    sub: "Received"         },
          { label: "Graded",             value: "—",                                            icon: CheckCircle2,bg: "bg-emerald-50", color: "text-emerald-600", sub: "With feedback"    },
          { label: "Pending Grade",      value: "—",                                            icon: Clock,       bg: "bg-orange-50",  color: "text-orange-500",  sub: "To evaluate"      },
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

      {/* Tabbed card */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
          {(["assignments", "submissions", "create"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "assignments" ? "My Assignments" : t === "submissions" ? "Student Submissions" : "Create Assignment"}
            </button>
          ))}
        </div>

        {tab === "assignments" && (
          <div className="p-5 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading assignments…</span>
              </div>
            )}
            {!loading && assignments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: textSub }} />
                <p className="text-sm font-medium" style={{ color: textMed }}>No assignments yet</p>
                <p className="text-xs mt-1" style={{ color: textSub }}>Use the "Create Assignment" tab to add one</p>
              </div>
            )}
            {!loading && assignments.map(a => {
              const isOverdue = a.due_date ? new Date(a.due_date) < new Date() : false;
              return (
                <div key={a.id} className="rounded-xl p-4 transition-all"
                  style={{ border: `1px solid ${border}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#8b5cf6"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{a.title}</p>
                      {a.description && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: textMed }}>{a.description}</p>}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? "#334155" : "#f1f5f9", color: textSub }}>
                          {subjects.find(s => s.id === a.subject_id)?.code ?? a.subject_id.slice(0, 8)}
                        </span>
                        {a.due_date && (
                          <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500" : ""}`} style={{ color: isOverdue ? undefined : textSub }}>
                            <Clock className="w-3 h-3" /> Due: {new Date(a.due_date).toLocaleDateString()}
                          </span>
                        )}
                        {a.max_marks && <span className="text-xs" style={{ color: textSub }}>Max: {a.max_marks} marks</span>}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${a.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                      style={{ fontWeight: 500 }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "submissions" && (
          <div className="p-8 text-center">
            <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: textSub }} />
            <p className="text-sm font-medium" style={{ color: textMed }}>Submission tracker</p>
            <p className="text-xs mt-1" style={{ color: textSub }}>Select an assignment to view and grade student submissions.</p>
          </div>
        )}

        {tab === "create" && (
          <div className="p-5 space-y-4">
            {createSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-700 text-sm" style={{ fontWeight: 500 }}>Assignment created! Redirecting…</p>
              </div>
            )}
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Assignment Title *</label>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Binary Tree Implementation"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Description</label>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3}
                placeholder="Detailed instructions for students…"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Subject *</label>
                <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.code} – {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Due Date</label>
                <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Max Score</label>
                <input type="number" min={1} max={100} value={newMaxScore} onChange={e => setNewMaxScore(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              </div>
            </div>
            <button onClick={handleCreate} disabled={creating || !newTitle.trim()}
              className="flex items-center gap-2 bg-violet-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
              style={{ fontWeight: 500 }}>
              {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><Plus className="w-4 h-4" /> Create Assignment</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
