import { useState, useEffect } from "react";
import { Bell, Send, CheckCircle2, AlertCircle, Users, Calendar, Clock, Loader2, Pin } from "lucide-react";
import { announcementsApi, AnnouncementOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const AUDIENCE_OPTIONS = [
  { label: "All (Students + Staff)", value: "all"      },
  { label: "Students Only",          value: "students"  },
  { label: "Staff Only",             value: "staff"     },
];

export function StaffAnnouncements() {
  const { isDark } = useTheme();
  const [announcements, setAnnouncements] = useState<AnnouncementOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState<"create" | "published">("published");
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [audience, setAudience] = useState("students");
  const [isPinned, setIsPinned] = useState(false);
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";

  const loadAnnouncements = () => {
    setLoading(true);
    announcementsApi.getAll()
      .then(res => { setAnnouncements(res.data); setError(""); })
      .catch(() => setError("Could not load announcements. Is the backend running?"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadAnnouncements(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    try {
      const res = await announcementsApi.create({ title, body, audience, is_pinned: isPinned });
      setAnnouncements(prev => [res.data, ...prev]);
      setSent(true);
      setTitle(""); setBody(""); setIsPinned(false);
      setTimeout(() => { setSent(false); setTab("published"); }, 2000);
    } catch { setError("Failed to publish announcement. Please try again."); }
    finally { setSending(false); }
  };

  const pinned      = announcements.filter(a => a.is_pinned);
  const urgentCount = pinned.length;

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
          { label: "Published",      value: loading ? "…" : announcements.length.toString(),                                     icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600", sub: "Total"          },
          { label: "Pinned / Urgent",value: loading ? "…" : urgentCount.toString(),                                               icon: AlertCircle,  bg: "bg-red-50",     color: "text-red-500",    sub: "Active alerts"  },
          { label: "Students",       value: loading ? "…" : announcements.filter(a => a.audience !== "staff").length.toString(),  icon: Users,        bg: "bg-blue-50",    color: "text-blue-600",   sub: "Announcements"  },
          { label: "Staff",          value: loading ? "…" : announcements.filter(a => a.audience !== "students").length.toString(),icon: Calendar,     bg: "bg-violet-50",  color: "text-violet-600", sub: "Announcements"  },
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
          {(["published", "create"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "published" ? `Published (${loading ? "…" : announcements.length})` : "Create Announcement"}
            </button>
          ))}
        </div>

        {/* Published list */}
        {tab === "published" && (
          <div className="p-5 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading announcements…</span>
              </div>
            )}
            {!loading && announcements.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: textSub }} />
                <p className="text-sm font-medium" style={{ color: textMed }}>No announcements yet</p>
                <p className="text-xs mt-1" style={{ color: textSub }}>Use "Create Announcement" to publish one</p>
              </div>
            )}
            {!loading && announcements.map(a => (
              <div key={a.id} className="rounded-xl p-4 transition-colors"
                style={{
                  border: `1px solid ${a.is_pinned ? "#fecaca" : border}`,
                  backgroundColor: a.is_pinned ? (isDark ? "rgba(239,68,68,0.06)" : "#fff5f5") : "transparent",
                }}>
                <div className="flex items-start gap-2 mb-1.5 flex-wrap">
                  {a.is_pinned && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-lg flex items-center gap-1"
                      style={{ fontWeight: 600 }}>
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${a.audience === "all" ? "bg-indigo-50 text-indigo-600" : a.audience === "students" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"}`}>
                    {a.audience === "all" ? "All" : a.audience === "students" ? "Students" : "Staff"}
                  </span>
                </div>
                <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{a.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: textMed }}>{a.body}</p>
                <div className="flex items-center gap-1.5 mt-2.5 text-xs" style={{ color: textSub }}>
                  <Clock className="w-3 h-3" />
                  Published {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create form */}
        {tab === "create" && (
          <div className="p-5 space-y-4">
            {sent && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <p className="text-emerald-700 text-sm" style={{ fontWeight: 500 }}>Announcement published! Redirecting…</p>
              </div>
            )}
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Enter announcement title…"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Message *</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
                placeholder="Write the announcement content here…"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none transition-colors"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Target Audience</label>
                <select value={audience} onChange={e => setAudience(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                  {AUDIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Priority</label>
                <div className="flex h-[42px] rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                  {[{ label: "Normal", val: false }, { label: "Pinned", val: true }].map(opt => (
                    <button key={opt.label} onClick={() => setIsPinned(opt.val)}
                      className={`flex-1 text-sm transition-colors ${isPinned === opt.val ? (opt.val ? "bg-red-500 text-white" : "bg-violet-600 text-white") : ""}`}
                      style={{ fontWeight: isPinned === opt.val ? 600 : 400, color: isPinned !== opt.val ? textMed : undefined, backgroundColor: isPinned !== opt.val ? inputBg : undefined }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}
              className="flex items-center gap-2 bg-violet-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 500 }}>
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</> : <><Send className="w-4 h-4" /> Publish Announcement</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
