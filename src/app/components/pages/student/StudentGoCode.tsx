import { useState, useEffect } from "react";
import { Code2, Trophy, Zap, CheckCircle2, XCircle, Clock, Loader2, AlertCircle, Play, ChevronRight } from "lucide-react";
import { goCodeApi, ProblemOut, LeaderboardEntry } from "@/lib/api";
import { useTheme } from "../../../context/ThemeContext";

const LANGUAGES = ["python3", "java", "cpp17", "javascript"];
const DIFF_COLOR: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-600",
  medium: "bg-amber-50 text-amber-600",
  hard: "bg-red-50 text-red-600",
};

export function StudentGoCode() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"problems" | "editor" | "leaderboard">("problems");
  const [problems, setProblems] = useState<ProblemOut[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [diffFilter, setDiffFilter] = useState<string>("");

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";
  const hoverBg = isDark ? "#0f172a"  : "#f8fafc";
  const [search, setSearch] = useState("");

  // Editor state
  const [selectedProblem, setSelectedProblem] = useState<ProblemOut | null>(null);
  const [language, setLanguage] = useState("python3");
  const [code, setCode] = useState("# Write your solution here\n\ndef solution():\n    pass\n");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ status: string; runtime_ms?: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      goCodeApi.getProblems(diffFilter ? { difficulty: diffFilter } : undefined),
      goCodeApi.getLeaderboard(),
    ])
      .then(([pRes, lRes]) => {
        setProblems(pRes.data);
        setLeaderboard(lRes.data);
        setError("");
      })
      .catch(() => setError("Could not load problems. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [diffFilter]);

  const openEditor = (p: ProblemOut) => {
    setSelectedProblem(p);
    setCode(`# Problem: ${p.title}\n# Language: python3\n\ndef solution():\n    # Your code here\n    pass\n`);
    setSubmitResult(null);
    setTab("editor");
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await goCodeApi.submitCode(selectedProblem.id, language, code);
      setSubmitResult({ status: res.data.status, runtime_ms: res.data.runtime_ms ?? undefined });
    } catch {
      setSubmitResult({ status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.tags ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const solved = 0; // Would come from my submissions count

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
          { label: "Total Problems", value: loading ? "…" : problems.length.toString(), icon: Code2, bg: "bg-violet-50", color: "text-violet-600", sub: "In problem bank" },
          { label: "Easy", value: loading ? "…" : problems.filter(p => p.difficulty === "easy").length.toString(), icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600", sub: "Beginner friendly" },
          { label: "Medium", value: loading ? "…" : problems.filter(p => p.difficulty === "medium").length.toString(), icon: Zap, bg: "bg-amber-50", color: "text-amber-500", sub: "Intermediate" },
          { label: "Hard", value: loading ? "…" : problems.filter(p => p.difficulty === "hard").length.toString(), icon: Trophy, bg: "bg-red-50", color: "text-red-500", sub: "Advanced" },
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

      {/* Tabs */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="flex" style={{ borderBottom: `1px solid ${border}` }}>
          {(["problems", "editor", "leaderboard"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-sm transition-colors"
              style={{
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? "#7c3aed" : textSub,
                backgroundColor: tab === t ? (isDark ? "rgba(124,58,237,0.1)" : "#f5f3ff") : "transparent",
                borderBottom: tab === t ? "2px solid #7c3aed" : "2px solid transparent",
              }}>
              {t === "problems" ? "Problem Bank" : t === "editor" ? "Code Editor" : "Leaderboard"}
            </button>
          ))}
        </div>

        {/* Problem Bank */}
        {tab === "problems" && (
          <div className="p-5 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search problems…"
                className="flex-1 min-w-[180px] rounded-xl px-4 py-2 text-sm outline-none"
                style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }} />
              <div className="flex gap-2">
                {["", "easy", "medium", "hard"].map(d => (
                  <button key={d} onClick={() => setDiffFilter(d)}
                    className="px-3 py-2 rounded-xl text-xs border transition-colors"
                    style={{
                      fontWeight: 500,
                      backgroundColor: diffFilter === d ? "#7c3aed" : inputBg,
                      color: diffFilter === d ? "#ffffff" : textMed,
                      borderColor: diffFilter === d ? "#7c3aed" : border,
                    }}>
                    {d === "" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading problems…</span>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm py-10" style={{ color: textSub }}>
                {search ? `No problems matching "${search}"` : "No problems yet. Staff will add them soon."}
              </p>
            )}
            {!loading && filtered.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl p-4 transition-all cursor-pointer"
                style={{ border: `1px solid ${border}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.backgroundColor = isDark ? "rgba(139,92,246,0.07)" : "#f5f3ff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.backgroundColor = "transparent"; }}
                onClick={() => openEditor(p)}>
                <span className="text-sm w-6 flex-shrink-0" style={{ color: textSub }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${DIFF_COLOR[p.difficulty]}`} style={{ fontWeight: 600 }}>
                      {p.difficulty}
                    </span>
                    {p.tags && JSON.parse(p.tags).slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: isDark ? "#334155" : "#f1f5f9", color: textSub }}>{tag}</span>
                    ))}
                  </div>
                  <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{p.title}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: textSub }} />
              </div>
            ))}
          </div>
        )}

        {/* Code Editor */}
        {tab === "editor" && (
          <div className="p-5 space-y-4">
            {!selectedProblem ? (
              <div className="text-center py-12">
                <Code2 className="w-12 h-12 mx-auto mb-3" style={{ color: textSub }} />
                <p className="text-sm font-medium" style={{ color: textMed }}>No problem selected</p>
                <p className="text-xs mt-1" style={{ color: textSub }}>Go to Problem Bank and click a problem to open the editor</p>
                <button onClick={() => setTab("problems")} className="mt-4 text-sm text-violet-600 hover:underline font-medium">
                  Browse Problems →
                </button>
              </div>
            ) : (
              <>
                {/* Problem details */}
                <div className="rounded-xl p-4" style={{ backgroundColor: inputBg, border: `1px solid ${border}` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${DIFF_COLOR[selectedProblem.difficulty]}`} style={{ fontWeight: 600 }}>
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: textPri }}>{selectedProblem.title}</p>
                  <p className="text-xs mt-1 leading-relaxed whitespace-pre-line line-clamp-4" style={{ color: textMed }}>{selectedProblem.description}</p>
                  {selectedProblem.constraints && (
                    <p className="text-xs mt-2" style={{ color: textSub }}><strong>Constraints:</strong> {selectedProblem.constraints}</p>
                  )}
                </div>

                {/* Language + Code */}
                <div className="flex items-center gap-3">
                  <label className="text-xs shrink-0" style={{ fontWeight: 500, color: textMed }}>Language:</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)}
                    className="rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ backgroundColor: inputBg, border: `1px solid ${border}`, color: textMed }}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <textarea
                  value={code} onChange={e => setCode(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full font-mono text-sm bg-slate-900 text-emerald-400 rounded-xl p-4 outline-none focus:ring-2 focus:ring-violet-500 resize-y border border-slate-700"
                  style={{ lineHeight: 1.6 }} />

                {/* Submit result */}
                {submitResult && (
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${submitResult.status === "accepted" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : submitResult.status === "pending" ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                    {submitResult.status === "accepted" ? <CheckCircle2 className="w-5 h-5" /> : submitResult.status === "pending" ? <Clock className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    <span style={{ fontWeight: 500 }}>
                      {submitResult.status === "accepted" ? `Accepted! ${submitResult.runtime_ms ? `Runtime: ${submitResult.runtime_ms}ms` : ""}` :
                        submitResult.status === "pending" ? "Submitted — Judge is evaluating…" :
                        submitResult.status === "error" ? "Submission error. Try again." :
                        `${submitResult.status.replace(/_/g, " ")}`}
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex items-center gap-2 bg-violet-600 text-white text-sm px-6 py-2.5 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60"
                    style={{ fontWeight: 500 }}>
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Play className="w-4 h-4" /> Submit Code</>}
                  </button>
                  <button onClick={() => { setSelectedProblem(null); setTab("problems"); }}
                    className="text-sm px-4 py-2.5 rounded-xl transition-colors"
                    style={{ fontWeight: 500, color: textMed, border: `1px solid ${border}` }}>
                    Back to Problems
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {tab === "leaderboard" && (
          <div>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-500 animate-spin mr-2" />
                <span className="text-sm" style={{ color: textSub }}>Loading leaderboard…</span>
              </div>
            )}
            {!loading && leaderboard.length === 0 && (
              <p className="text-center text-sm py-12" style={{ color: textSub }}>No submissions yet. Be the first to solve a problem!</p>
            )}
            {!loading && leaderboard.map((e, i) => (
              <div key={e.student_id} className="flex items-center gap-4 px-5 py-4 transition-colors"
                style={{ borderTop: i > 0 ? `1px solid ${border}` : "none" }}
                onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = hoverBg)}
                onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = "transparent")}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-700" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`} style={{ fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{e.student_name}</p>
                  <p className="text-xs" style={{ color: textSub }}>{e.solved}/{e.total} problems solved</p>
                </div>
                <div className="text-right">
                  <p className="text-violet-600 text-sm" style={{ fontWeight: 700 }}>{e.score.toFixed(1)}%</p>
                  <p className="text-xs" style={{ color: textSub }}>Score</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
