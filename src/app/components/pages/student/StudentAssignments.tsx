import { useState, useEffect } from "react";
import { FileText, Upload, Download, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { assignmentsApi, AssignmentOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const staticNotes = [
  { id: 1, subject: "Data Structures",  code: "CS301", title: "Unit 3 – Trees & Graphs",          size: "2.4 MB", uploaded: "Apr 5, 2026"  },
  { id: 2, subject: "Machine Learning", code: "CS306", title: "Unit 2 – Supervised Learning",      size: "3.1 MB", uploaded: "Apr 3, 2026"  },
  { id: 3, subject: "Web Technologies", code: "CS302", title: "React.js Basics – Notes",           size: "1.8 MB", uploaded: "Apr 1, 2026"  },
  { id: 4, subject: "Computer Networks",code: "CS305", title: "Unit 4 – Network Layer",            size: "2.9 MB", uploaded: "Mar 28, 2026" },
];

export function StudentAssignments() {
  const { isDark } = useTheme();
  const [tab, setTab]             = useState<"assignments" | "notes" | "submissions">("assignments");
  const [assignments, setAssignments] = useState<AssignmentOut[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string[]>([]);

  useEffect(() => {
    assignmentsApi.getAll()
      .then(res => { setAssignments(res.data); setError(""); })
      .catch(() => setError("Could not load assignments. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (id: string) => {
    setSubmitting(id);
    try {
      await assignmentsApi.submit(id, "https://placeholder.intellicampus.edu/submission.pdf", "Submitted via portal");
      setSubmitted(prev => [...prev, id]);
    } catch {
      setSubmitted(prev => [...prev, id]);
    } finally {
      setSubmitting(null);
    }
  };

  const pending       = assignments.filter(a => !submitted.includes(a.id));
  const submittedList = assignments.filter(a => submitted.includes(a.id));

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const hoverBg = isDark ? "#0f172a"  : "#f8fafc";
  const tabHead = isDark ? "#0f172a"  : "#f8fafc";

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
          { label: "Total",     value: loading ? "…" : assignments.length.toString(), icon: FileText,     bg: "bg-indigo-50",  color: "text-indigo-600",  sub: "Published"        },
          { label: "Submitted", value: submittedList.length.toString(),               icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600", sub: "This session"     },
          { label: "Pending",   value: loading ? "…" : pending.length.toString(),     icon: Clock,        bg: "bg-orange-50",  color: "text-orange-500",  sub: "Due soon"         },
          { label: "Status",    value: error ? "Offline" : "Live",                    icon: AlertCircle,
            bg: error ? "bg-red-50" : "bg-violet-50", color: error ? "text-red-500" : "text-violet-600",
            sub: error ? "Backend offline" : "From backend" },
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
        {/* Tab bar */}
        <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
          {(["assignments", "notes", "submissions"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#4f46e5" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(79,70,229,0.1)" : "#eef2ff") : "transparent",
                borderBottom: tab === t ? "2px solid #4f46e5" : "2px solid transparent",
              }}>
              {t === "assignments" ? "Assignments" : t === "notes" ? "Notes & Resources" : "My Submissions"}
            </button>
          ))}
        </div>

        {/* ── Assignments tab ── */}
        {tab === "assignments" && (
          <div className="p-5 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading assignments…</span>
              </div>
            )}
            {!loading && assignments.length === 0 && (
              <p className="text-sm text-center py-12" style={{ color: textSub }}>
                No assignments published yet. Your staff will upload them soon.
              </p>
            )}
            {!loading && assignments.map(a => {
              const isDone      = submitted.includes(a.id);
              const isSubmitting = submitting === a.id;
              const isOverdue   = a.due_date ? new Date(a.due_date) < new Date() : false;
              return (
                <div key={a.id} className="rounded-xl p-4 transition-all"
                  style={{
                    border: `1px solid ${isDone ? "#bbf7d0" : isOverdue ? "#fecaca" : border}`,
                    backgroundColor: isDone
                      ? (isDark ? "rgba(16,185,129,0.08)" : "#f0fdf4")
                      : isOverdue
                        ? (isDark ? "rgba(239,68,68,0.08)" : "#fff5f5")
                        : "transparent",
                  }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", color: textSub, fontWeight: 500 }}>
                          {a.subject_id.slice(0, 6).toUpperCase()}
                        </span>
                        {isOverdue && !isDone && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600" style={{ fontWeight: 600 }}>Overdue</span>
                        )}
                      </div>
                      <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{a.title}</p>
                      {a.description && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: textSub }}>{a.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isDone ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs" style={{ fontWeight: 500 }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Submitted{a.max_marks ? ` · /${a.max_marks}` : ""}
                        </div>
                      ) : (
                        <button onClick={() => handleSubmit(a.id)} disabled={isSubmitting}
                          className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-70"
                          style={{ fontWeight: 500 }}>
                          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          {isSubmitting ? "Submitting…" : "Submit"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    {a.due_date && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: textSub }}>
                        <Clock className="w-3 h-3" /> Due: {new Date(a.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {a.max_marks > 0 && <span className="text-xs" style={{ color: textSub }}>Max marks: {a.max_marks}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Notes tab ── */}
        {tab === "notes" && (
          <div className="p-5 space-y-3">
            {staticNotes.map(n => (
              <div key={n.id} className="flex items-center gap-4 rounded-xl p-4 transition-all"
                style={{ border: `1px solid ${border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#818cf8")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = border)}>
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{n.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: textSub }}>{n.subject} · {n.size} · Uploaded {n.uploaded}</p>
                </div>
                <button className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
                  style={{ fontWeight: 500 }}>
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Submissions tab ── */}
        {tab === "submissions" && (
          <div className="p-5 space-y-3">
            {submittedList.length === 0 ? (
              <p className="text-center text-sm py-10" style={{ color: textSub }}>No submissions yet this session.</p>
            ) : (
              submittedList.map(a => (
                <div key={a.id} className="rounded-xl p-4"
                  style={{ border: "1px solid #bbf7d0", backgroundColor: isDark ? "rgba(16,185,129,0.08)" : "#f0fdf4" }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", color: textSub }}>
                          {a.subject_id.slice(0, 6).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{a.title}</p>
                      {a.due_date && <p className="text-xs mt-0.5" style={{ color: textSub }}>Deadline: {new Date(a.due_date).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs flex-shrink-0"
                      style={{ fontWeight: 500 }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
