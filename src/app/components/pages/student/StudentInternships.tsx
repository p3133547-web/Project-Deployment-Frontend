import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, CheckCircle2, AlertCircle, Loader2, Send, Building2, ExternalLink } from "lucide-react";
import { internshipsApi, InternshipOut, ApplicationOut } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const TYPE_COLOR: Record<string, string> = {
  remote: "bg-blue-50 text-blue-600",
  onsite: "bg-violet-50 text-violet-600",
  hybrid: "bg-indigo-50 text-indigo-600",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  shortlisted: "bg-blue-50 text-blue-600",
  selected: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
  withdrawn: "bg-slate-100 text-slate-500",
};

export function StudentInternships() {
  const { isDark } = useTheme();
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";
  const [tab, setTab] = useState<"listings" | "applications">("listings");
  const [listings, setListings] = useState<InternshipOut[]>([]);
  const [applications, setApplications] = useState<ApplicationOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Apply modal state
  const [applying, setApplying] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState<string[]>([]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      internshipsApi.getAll(),
      internshipsApi.getMyApplications(),
    ])
      .then(([listRes, appRes]) => {
        setListings(listRes.data);
        setApplications(appRes.data);
        setApplied(appRes.data.map(a => a.internship_id));
        setError("");
      })
      .catch(() => setError("Could not load internships. Is the backend running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleApply = async (internshipId: string) => {
    setSubmitting(true);
    try {
      const res = await internshipsApi.apply(internshipId, {
        cover_letter: coverLetter || undefined,
        resume_url: "https://placeholder.intellicampus.edu/resume.pdf",
      });
      setApplications(prev => [...prev, res.data]);
      setApplied(prev => [...prev, internshipId]);
      setApplying(null);
      setCoverLetter("");
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setApplied(prev => [...prev, internshipId]);
        setApplying(null);
      } else {
        setError("Failed to apply. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );

  const open = listings.filter(l => l.status === "open");

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
          { label: "Open Listings", value: loading ? "…" : open.length.toString(), icon: Briefcase, bg: "bg-violet-50", color: "text-violet-600", sub: "Apply now" },
          { label: "Applied", value: loading ? "…" : applications.length.toString(), icon: Send, bg: "bg-blue-50", color: "text-blue-600", sub: "Your applications" },
          { label: "Shortlisted", value: loading ? "…" : applications.filter(a => a.status === "shortlisted").length.toString(), icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600", sub: "Review stage" },
          { label: "Selected", value: loading ? "…" : applications.filter(a => a.status === "selected").length.toString(), icon: Building2, bg: "bg-amber-50", color: "text-amber-500", sub: "Congratulations!" },
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

      {/* Apply Modal */}
      {applying && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
            style={{ backgroundColor: card }}>
            <h3 className="text-base" style={{ fontWeight: 700, color: textPri }}>Apply for Internship</h3>
            <div>
              <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: textMed }}>Cover Letter (optional)</label>
              <textarea rows={4} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                placeholder="Briefly introduce yourself and why you're interested…"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleApply(applying)} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
                style={{ fontWeight: 500 }}>
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Application</>}
              </button>
              <button onClick={() => { setApplying(null); setCoverLetter(""); }}
                className="px-4 py-2.5 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 500, border: `1px solid ${border}`, color: textMed }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
          {(["listings", "applications"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "listings" ? `Open Listings (${open.length})` : `My Applications (${applications.length})`}
            </button>
          ))}
        </div>

        {tab === "listings" && (
          <div className="p-5 space-y-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by role or company…"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
                <span className="text-slate-500 text-sm">Loading listings…</span>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: textSub }} />
                <p className="text-sm font-medium" style={{ color: textMed }}>{search ? `No results for "${search}"` : "No open internships right now"}</p>
                <p className="text-xs mt-1" style={{ color: textSub }}>Check back soon — staff will post new listings</p>
              </div>
            )}
            {!loading && filtered.map(l => {
              const isApplied = applied.includes(l.id);
              return (
                <div key={l.id} className="rounded-xl p-5 transition-all"
                  style={{
                    border: `1px solid ${isApplied ? "#bbf7d0" : border}`,
                    backgroundColor: isApplied ? (isDark ? "rgba(16,185,129,0.08)" : "#f0fdf4") : "transparent",
                  }}
                  onMouseEnter={e => { if (!isApplied) { e.currentTarget.style.borderColor = "#8b5cf6"; } }}
                  onMouseLeave={e => { if (!isApplied) { e.currentTarget.style.borderColor = border; } }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-lg ${TYPE_COLOR[l.type] ?? "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 500 }}>
                          {l.type}
                        </span>
                        {l.stipend && (
                          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg" style={{ fontWeight: 500 }}>
                            {l.stipend}
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ fontWeight: 700, color: textPri }}>{l.title}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs" style={{ color: textMed }}>
                          <Building2 className="w-3 h-3" /> {l.company}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: textMed }}>
                          <MapPin className="w-3 h-3" /> {l.location}
                        </span>
                        {l.duration && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: textMed }}>
                            <Clock className="w-3 h-3" /> {l.duration}
                          </span>
                        )}
                      </div>
                      {l.description && (
                        <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: textSub }}>{l.description}</p>
                      )}
                      {l.deadline && (
                        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: textSub }}>
                          <Clock className="w-3 h-3" />
                          Apply by: {new Date(l.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isApplied ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs px-3 py-2 rounded-xl" style={{ fontWeight: 500 }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                        </div>
                      ) : (
                        <button onClick={() => setApplying(l.id)}
                          className="flex items-center gap-1.5 bg-violet-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
                          style={{ fontWeight: 500 }}>
                          <Send className="w-3.5 h-3.5" /> Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "applications" && (
          <div className="p-5 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
              </div>
            )}
            {!loading && applications.length === 0 && (
              <div className="text-center py-12">
                <Send className="w-10 h-10 mx-auto mb-3" style={{ color: textSub }} />
                <p className="text-sm font-medium" style={{ color: textMed }}>No applications yet</p>
                <p className="text-xs mt-1" style={{ color: textSub }}>Go to listings and apply to internships</p>
              </div>
            )}
            {!loading && applications.map(a => {
              const listing = listings.find(l => l.id === a.internship_id);
              return (
                <div key={a.id} className="rounded-xl p-4" style={{ border: `1px solid ${border}` }}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>
                        {listing?.title ?? "Internship"}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: textSub }}>
                        {listing?.company ?? ""} · Applied {new Date(a.applied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-lg flex-shrink-0 ${STATUS_COLOR[a.status] ?? "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 600 }}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                  {a.remarks && (
                    <p className="text-xs mt-2 italic" style={{ color: textMed }}>"{a.remarks}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
