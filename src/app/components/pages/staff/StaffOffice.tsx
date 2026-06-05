import { useState } from "react";
import { Shield, Search, CheckCircle2, AlertCircle, CreditCard, User, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const records = [
  { id: 1, rollNo: "21CS012", name: "Karunakaran M.", idNo: "DIS-2026-001", reason: "Dress code violation", issued: "Apr 8, 2026", status: "Issued", section: "III CSE A" },
  { id: 2, rollNo: "21CS027", name: "Divya R.", idNo: "DIS-2026-002", reason: "Late attendance (repeated)", issued: "Apr 9, 2026", status: "Collected", section: "III CSE B" },
  { id: 3, rollNo: "21CS034", name: "Arun K.", idNo: "DIS-2026-003", reason: "Mobile phone used in class", issued: "Apr 10, 2026", status: "Issued", section: "III CSE A" },
];

export function StaffOffice() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"records" | "issue">("records");
  const [query, setQuery] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [reason, setReason] = useState("");
  const [issued, setIssued] = useState(false);
  const [actionType, setActionType] = useState<"issue" | "collect">("issue");

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";
  const hoverBg = isDark ? "#0f172a"  : "#f8fafc";

  const filtered = records.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.rollNo.toLowerCase().includes(query.toLowerCase()) ||
    r.idNo.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Issued",      value: records.length.toString(),                                      icon: CreditCard,  bg: "bg-red-50",     color: "text-red-500",     sub: "This semester"     },
          { label: "Active (Held)",     value: records.filter(r => r.status === "Issued").length.toString(),   icon: AlertCircle, bg: "bg-amber-50",   color: "text-amber-500",   sub: "Not yet returned"  },
          { label: "Collected",         value: records.filter(r => r.status === "Collected").length.toString(),icon: CheckCircle2,bg: "bg-emerald-50", color: "text-emerald-600", sub: "Returned"          },
          { label: "Students Affected", value: records.length.toString(),                                      icon: User,        bg: "bg-indigo-50",  color: "text-indigo-600",  sub: "Unique students"   },
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
          {(["records", "issue"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "records" ? "Disciplinary ID Records" : "Issue / Collect ID"}
            </button>
          ))}
        </div>

        {tab === "records" && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors"
                 style={{ backgroundColor: inputBg, border: `1px solid ${border}` }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: textSub }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, roll number, or ID..."
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: textMed }} />
            </div>
            <div className="space-y-3">
              {filtered.map(r => (
                <div key={r.id} className="rounded-xl p-4 transition-colors"
                  style={{
                    border: `1px solid ${r.status === "Issued" ? "#fecaca" : "#bbf7d0"}`,
                    backgroundColor: r.status === "Issued" ? (isDark ? "rgba(239,68,68,0.06)" : "#fff5f5") : (isDark ? "rgba(16,185,129,0.06)" : "#f0fdf4"),
                  }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${r.status === "Issued" ? "bg-red-50" : "bg-emerald-50"}`}>
                        {r.status === "Issued" ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : <ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{r.name}</p>
                        <p className="text-xs" style={{ color: textSub }}>{r.rollNo} · {r.section}</p>
                        <p className="text-xs mt-1" style={{ color: textMed }}>Reason: {r.reason}</p>
                        <p className="text-xs mt-0.5" style={{ color: textSub }}>ID: <span style={{ fontWeight: 500 }}>{r.idNo}</span> · Issued: {r.issued}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-lg flex-shrink-0 ${r.status === "Issued" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`} style={{ fontWeight: 500 }}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-center text-sm py-6" style={{ color: textSub }}>No records found.</p>}
            </div>
          </div>
        )}

        {tab === "issue" && (
          <div className="p-5 space-y-4">
            {issued && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-700 text-sm" style={{ fontWeight: 500 }}>
                  Disciplinary ID {actionType === "issue" ? "issued" : "collected"} and recorded successfully.
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Action Type</label>
                <div className="flex rounded-xl overflow-hidden h-[42px]" style={{ border: `1px solid ${border}` }}>
                  <button onClick={() => setActionType("issue")}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs transition-colors ${actionType === "issue" ? "bg-red-500 text-white" : ""}`}
                    style={{
                      fontWeight: actionType === "issue" ? 600 : 400,
                      backgroundColor: actionType !== "issue" ? inputBg : undefined,
                      color: actionType !== "issue" ? textMed : undefined
                    }}>
                    <ArrowUpRight className="w-3.5 h-3.5" /> Issue
                  </button>
                  <button onClick={() => setActionType("collect")}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs transition-colors ${actionType === "collect" ? "bg-emerald-600 text-white" : ""}`}
                    style={{
                      fontWeight: actionType === "collect" ? 600 : 400,
                      backgroundColor: actionType !== "collect" ? inputBg : undefined,
                      color: actionType !== "collect" ? textMed : undefined
                    }}>
                    <ArrowDownLeft className="w-3.5 h-3.5" /> Collect
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Section</label>
                <select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {["III CSE A", "III CSE B"].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Student Roll Number *</label>
              <input type="text" value={rollNo} onChange={e => setRollNo(e.target.value)} placeholder="e.g. 21CS012"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            {actionType === "issue" && (
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Reason for Disciplinary Action *</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Describe the reason for issuing this ID..."
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              </div>
            )}
            <button onClick={() => { if (rollNo.trim()) setIssued(true); }}
              className={`flex items-center gap-2 text-white text-sm px-5 py-2.5 rounded-xl transition-colors ${actionType === "issue" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
              style={{ fontWeight: 500 }}>
              <CreditCard className="w-4 h-4" />
              {actionType === "issue" ? "Issue Disciplinary ID" : "Mark as Collected"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
