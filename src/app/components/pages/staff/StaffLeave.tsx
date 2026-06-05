import { useState, useEffect } from "react";
import { CheckCircle2, X, Clock, Calendar, Send, Loader2, AlertCircle } from "lucide-react";
import { leaveApi, LeaveOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const LEAVE_TYPES = ["sick", "od", "casual", "emergency"];

export function StaffLeave() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"pending" | "history" | "apply">("pending");
  const [leaves, setLeaves] = useState<LeaveOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decidingId, setDecidingId] = useState<string | null>(null);

  // Apply form
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";

  const loadLeaves = () => {
    leaveApi.getAll()
      .then(res => { setLeaves(res.data); setError(""); })
      .catch(() => setError("Could not load leave requests."))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadLeaves(); }, []);

  const pending = leaves.filter(l => l.status === "pending");
  const history = leaves.filter(l => l.status !== "pending");
  const approved = leaves.filter(l => l.status === "approved").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;
  const odCount = leaves.filter(l => l.leave_type?.toLowerCase().includes("od")).length;

  const decide = async (id: string, action: "approved" | "rejected") => {
    setDecidingId(id);
    try {
      await leaveApi.updateStatus(id, action);
      setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status: action } : l)));
    } catch {
      setError("Could not update leave status.");
    } finally {
      setDecidingId(null);
    }
  };

  const handleApply = async () => {
    if (!fromDate || !toDate || !reason.trim()) return;
    setSubmitting(true);
    try {
      await leaveApi.apply({ leave_type: leaveType, from_date: fromDate, to_date: toDate, reason });
      setSubmitSuccess(true);
      setFromDate(""); setToDate(""); setReason("");
      loadLeaves();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setError("Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
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
          { label: "Pending",   value: loading ? "…" : pending.length.toString(), icon: Clock,       bg: "bg-amber-50",   color: "text-amber-500",   sub: "Awaiting decision" },
          { label: "Approved",  value: loading ? "…" : approved.toString(),       icon: CheckCircle2,bg: "bg-emerald-50", color: "text-emerald-600", sub: "Total all time"    },
          { label: "Rejected",  value: loading ? "…" : rejected.toString(),       icon: X,           bg: "bg-red-50",     color: "text-red-500",     sub: "Total all time"    },
          { label: "OD Requests",value: loading ? "…" : odCount.toString(),        icon: Calendar,    bg: "bg-indigo-50",  color: "text-indigo-600",  sub: "All time"          },
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
          {(["pending", "history", "apply"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "pending" ? `Pending (${pending.length})` : t === "history" ? "History" : "Apply Own Leave"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
            <span className="text-sm" style={{ color: textSub }}>Loading leave requests…</span>
          </div>
        )}

        {!loading && tab === "pending" && (
          <div className="p-5 space-y-3">
            {pending.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm" style={{ fontWeight: 500, color: textMed }}>All requests have been processed!</p>
              </div>
            ) : (
              pending.map(req => (
                <div key={req.id} className="rounded-xl p-4" style={{ border: `1px solid ${border}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs flex-shrink-0" style={{ fontWeight: 700 }}>
                        {req.student_name ? req.student_name.split(" ").map(w => w[0]).join("") : "ST"}
                      </div>
                      <div>
                        <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{req.student_name ?? "Student"}</p>
                        <p className="text-xs" style={{ color: textSub }}>{req.student_roll ?? ""}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${req.leave_type?.toLowerCase().includes("medical") ? "bg-red-50 text-red-600" : req.leave_type?.toLowerCase().includes("od") ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-500"}`} style={{ fontWeight: 500 }}>
                            {req.leave_type}
                          </span>
                          <span className="text-xs" style={{ color: textSub }}>
                            {new Date(req.from_date).toLocaleDateString()} → {new Date(req.to_date).toLocaleDateString()}
                          </span>
                        </div>
                        {req.reason && <p className="text-xs mt-1.5 leading-relaxed italic" style={{ color: textMed }}>"{req.reason}"</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => decide(req.id, "approved")} disabled={decidingId === req.id}
                        className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60" style={{ fontWeight: 500 }}>
                        {decidingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        Approve
                      </button>
                      <button onClick={() => decide(req.id, "rejected")} disabled={decidingId === req.id}
                        className="flex items-center gap-1 bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60" style={{ fontWeight: 500 }}>
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                  <p className="text-xs mt-2.5" style={{ color: textSub }}>
                    Submitted: {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && tab === "history" && (
          <div className="p-5 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: textSub }}>No leave history yet.</p>
            ) : (
              history.map(r => (
                <div key={r.id} className="rounded-xl p-4"
                  style={{
                    border: `1px solid ${r.status === "approved" ? "#bbf7d0" : "#fecaca"}`,
                    backgroundColor: r.status === "approved" ? (isDark ? "rgba(16,185,129,0.06)" : "#f0fdf4") : (isDark ? "rgba(239,68,68,0.06)" : "#fff5f5"),
                  }}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{r.student_name ?? "Student"}</p>
                      <p className="text-xs" style={{ color: textSub }}>
                        {r.leave_type} · {new Date(r.from_date).toLocaleDateString()} → {new Date(r.to_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-lg ${r.status === "approved" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`} style={{ fontWeight: 500 }}>
                      {r.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "apply" && (
          <div className="p-5 space-y-4">
            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-700 text-sm" style={{ fontWeight: 500 }}>Leave request submitted successfully!</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Leave Type</label>
                <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {LEAVE_TYPES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>From Date *</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>To Date *</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Reason *</label>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Brief reason for leave..."
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <button onClick={handleApply} disabled={submitting || !fromDate || !toDate || !reason.trim()}
              className="flex items-center gap-2 bg-violet-600 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
              style={{ fontWeight: 500 }}>
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit to HOD</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
