import { useState, useEffect } from "react";
import { Bell, BookOpen, Briefcase, Check, Calendar, Loader2, AlertCircle, Pin } from "lucide-react";
import { announcementsApi, AnnouncementOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

type FilterAudience = "all" | "students" | "staff";

export function StudentInbox() {
  const { isDark }  = useTheme();
  const [announcements, setAnnouncements] = useState<AnnouncementOut[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState<FilterAudience>("all");
  const [selected, setSelected] = useState<AnnouncementOut | null>(null);
  const [readIds, setReadIds]   = useState<Set<string>>(new Set());

  useEffect(() => {
    announcementsApi.getAll()
      .then(res => { setAnnouncements(res.data); setError(""); })
      .catch(() => setError("Could not load announcements. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  // ── Themed tokens ─────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";

  const filtered   = announcements.filter(a => filter === "all" ? true : a.audience === filter || a.audience === "all");
  const pinned     = filtered.filter(a => a.is_pinned);
  const regular    = filtered.filter(a => !a.is_pinned);
  const allItems   = [...pinned, ...regular];
  const unread     = allItems.filter(a => !readIds.has(a.id)).length;

  const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]));
  const markAll  = () => setReadIds(new Set(allItems.map(a => a.id)));
  const open     = (a: AnnouncementOut) => { setSelected(a); markRead(a.id); };

  const getCategoryStyle = (a: AnnouncementOut) => {
    if (a.is_pinned)            return { color: "text-orange-600", bg: "bg-orange-50", label: "Pinned",   Icon: Pin       };
    if (a.audience === "students") return { color: "text-blue-600",   bg: "bg-blue-50",   label: "Academic", Icon: BookOpen  };
    if (a.audience === "staff")    return { color: "text-violet-600", bg: "bg-violet-50", label: "Staff",    Icon: Briefcase };
    return { color: "text-slate-600", bg: "bg-slate-100", label: "General", Icon: Bell };
  };

  const audienceFilters: { key: FilterAudience; label: string; bg: string; color: string }[] = [
    { key: "all",      label: "All",      bg: "bg-slate-100",  color: "text-slate-600"  },
    { key: "students", label: "Students", bg: "bg-blue-50",    color: "text-blue-600"   },
    { key: "staff",    label: "Staff",    bg: "bg-violet-50",  color: "text-violet-600" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, color: textPri }}>Inbox & Announcements</h2>
            <p className="text-xs" style={{ color: textSub }}>
              {loading ? "Loading…" : `${announcements.length} announcements · ${unread} unread`}
            </p>
          </div>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="flex items-center gap-1.5 text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
            style={{ fontWeight: 500 }}>
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3 mb-5"
          style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: "1px solid #fde68a" }}>
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── List column ── */}
        <div className="lg:col-span-1 space-y-3">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {audienceFilters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all`}
                style={{
                  fontWeight: filter === f.key ? 600 : 500,
                  backgroundColor: filter === f.key ? (isDark ? "rgba(99,102,241,0.15)" : "#eef2ff") : (isDark ? "#1e293b" : "#ffffff"),
                  color: filter === f.key ? "#4f46e5" : textMed,
                  borderColor: filter === f.key ? "#818cf8" : border,
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
              <span className="text-sm" style={{ color: textSub }}>Loading…</span>
            </div>
          )}
          {!loading && allItems.length === 0 && (
            <div className="text-center py-10">
              <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: textSub }} />
              <p className="text-sm" style={{ color: textSub }}>No announcements yet</p>
            </div>
          )}

          <div className="space-y-2">
            {!loading && allItems.map(a => {
              const { color, bg, Icon } = getCategoryStyle(a);
              const isRead = readIds.has(a.id);
              return (
                <div key={a.id} onClick={() => open(a)}
                  className="rounded-xl cursor-pointer transition-all hover:shadow-md p-4"
                  style={{
                    backgroundColor: card,
                    border: `1px solid ${selected?.id === a.id ? "#818cf8" : !isRead ? "#93c5fd" : border}`,
                    boxShadow: selected?.id === a.id ? "0 0 0 2px rgba(129,140,248,0.2)" : "none",
                  }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm leading-snug line-clamp-2"
                          style={{ fontWeight: !isRead ? 600 : 400, color: textPri }}>{a.title}</p>
                        {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: textSub }}>
                        <Calendar className="w-3 h-3" />
                        {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
              <div className="px-6 py-4 flex items-start justify-between gap-4"
                style={{ borderBottom: `1px solid ${border}` }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {selected.is_pinned && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 flex items-center gap-1"
                        style={{ fontWeight: 600 }}>
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      selected.audience === "students" ? "bg-blue-50 text-blue-600" :
                      selected.audience === "staff"    ? "bg-violet-50 text-violet-600" :
                      "bg-slate-100 text-slate-600"}`}
                      style={{ fontWeight: 600 }}>
                      {selected.audience === "all" ? "All" : selected.audience === "students" ? "Students" : "Staff"}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: textPri }}>{selected.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: textSub }}>
                    <span>
                      {new Date(selected.created_at).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                      {" · "}
                      {new Date(selected.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="leading-relaxed whitespace-pre-line" style={{ color: textMed }}>{selected.body}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-dashed flex flex-col items-center justify-center py-20"
              style={{ backgroundColor: card, border: `2px dashed ${border}` }}>
              <Bell className="w-10 h-10 mb-3" style={{ color: textSub }} />
              <p className="text-sm" style={{ fontWeight: 500, color: textSub }}>Select an announcement to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
