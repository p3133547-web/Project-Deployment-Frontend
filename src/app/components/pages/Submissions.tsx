import { useState } from "react";
import {
  FileCheck,
  Download,
  Eye,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";

const submissions = [
  {
    id: 1,
    title: "Database Normalization",
    course: "CS360",
    subject: "Database Systems",
    submittedOn: "Apr 4, 2026",
    submittedAt: "11:45 PM",
    status: "graded",
    grade: 88,
    maxGrade: 90,
    letterGrade: "A",
    feedback: "Excellent normalization up to BCNF. ER diagrams are clear and well-structured. Minor issue with functional dependency notation in section 3.",
    file: "db_normalization_alex.pdf",
    fileSize: "2.4 MB",
    dueDate: "Apr 5, 2026",
    onTime: true,
  },
  {
    id: 2,
    title: "Network Protocols Quiz",
    course: "CS420",
    subject: "Computer Networks",
    submittedOn: "Mar 27, 2026",
    submittedAt: "10:20 AM",
    status: "graded",
    grade: 36,
    maxGrade: 40,
    letterGrade: "A-",
    feedback: "Strong understanding of TCP/IP and DNS. Lost points on routing algorithms — review Dijkstra and OSPF.",
    file: "quiz_submission.pdf",
    fileSize: "0.8 MB",
    dueDate: "Mar 28, 2026",
    onTime: true,
  },
  {
    id: 3,
    title: "Sorting Algorithms Analysis",
    course: "CS301",
    subject: "Data Structures",
    submittedOn: "Mar 15, 2026",
    submittedAt: "3:00 PM",
    status: "graded",
    grade: 72,
    maxGrade: 80,
    letterGrade: "B+",
    feedback: "Good analysis overall. The time complexity proofs need more rigor. Space complexity analysis was missing for merge sort.",
    file: "sorting_analysis.zip",
    fileSize: "5.1 MB",
    dueDate: "Mar 15, 2026",
    onTime: true,
  },
  {
    id: 4,
    title: "Linear Regression Model",
    course: "CS445",
    subject: "Machine Learning",
    submittedOn: "Mar 8, 2026",
    submittedAt: "11:58 PM",
    status: "graded",
    grade: 65,
    maxGrade: 75,
    letterGrade: "B",
    feedback: "Model implementation is correct. Feature engineering could be improved. Cross-validation was not properly implemented.",
    file: "linear_regression.ipynb",
    fileSize: "3.7 MB",
    dueDate: "Mar 9, 2026",
    onTime: true,
  },
  {
    id: 5,
    title: "Shell Scripting Assignment",
    course: "CS330",
    subject: "Operating Systems",
    submittedOn: "Apr 8, 2026",
    submittedAt: "9:15 AM",
    status: "pending-review",
    grade: null,
    maxGrade: 50,
    letterGrade: null,
    feedback: null,
    file: "shell_scripts.tar.gz",
    fileSize: "1.2 MB",
    dueDate: "Apr 8, 2026",
    onTime: true,
  },
];

const letterGradeColor: Record<string, string> = {
  "A": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "A-": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "B+": "text-blue-700 bg-blue-50 border-blue-200",
  "B": "text-blue-600 bg-blue-50 border-blue-200",
  "B-": "text-blue-500 bg-blue-50 border-blue-200",
  "C+": "text-amber-600 bg-amber-50 border-amber-200",
};

const totalPoints = submissions.filter(s => s.grade !== null).reduce((acc, s) => acc + (s.grade ?? 0), 0);
const maxPoints = submissions.filter(s => s.grade !== null).reduce((acc, s) => acc + s.maxGrade, 0);
const avgPercent = Math.round((totalPoints / maxPoints) * 100);

export function Submissions() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);

  const filtered = submissions.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-500">Submitted</span>
          </div>
          <p className="text-slate-800" style={{ fontSize: 22, fontWeight: 700 }}>{submissions.length}</p>
          <p className="text-slate-400 text-xs">Total submissions</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-slate-500">Graded</span>
          </div>
          <p className="text-slate-800" style={{ fontSize: 22, fontWeight: 700 }}>{submissions.filter(s => s.status === "graded").length}</p>
          <p className="text-slate-400 text-xs">With feedback</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span className="text-xs text-slate-500">Avg Score</span>
          </div>
          <p className="text-slate-800" style={{ fontSize: 22, fontWeight: 700 }}>{avgPercent}%</p>
          <p className="text-slate-400 text-xs">{totalPoints}/{maxPoints} pts</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500">On Time</span>
          </div>
          <p className="text-slate-800" style={{ fontSize: 22, fontWeight: 700 }}>100%</p>
          <p className="text-slate-400 text-xs">All on schedule</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none flex-1"
          />
        </div>
      </div>

      {/* Submissions list */}
      <div className="space-y-3">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-5 py-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${s.status === "graded" ? "bg-emerald-50" : "bg-amber-50"}`}>
                  {s.status === "graded" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{s.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.course} · {s.subject}</p>
                    </div>
                    {s.letterGrade ? (
                      <span className={`text-sm px-3 py-1 rounded-xl border flex-shrink-0 ${letterGradeColor[s.letterGrade] ?? "text-slate-600 bg-slate-50 border-slate-200"}`} style={{ fontWeight: 700 }}>
                        {s.letterGrade}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0" style={{ fontWeight: 500 }}>
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>📄 {s.file} ({s.fileSize})</span>
                    <span>Submitted: {s.submittedOn} at {s.submittedAt}</span>
                    {s.onTime && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> On time</span>}
                  </div>

                  {/* Score bar */}
                  {s.grade !== null && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Score</span>
                        <span className="text-xs text-slate-700" style={{ fontWeight: 600 }}>{s.grade}/{s.maxGrade} pts</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${(s.grade / s.maxGrade) >= 0.9 ? "bg-emerald-500" : (s.grade / s.maxGrade) >= 0.75 ? "bg-blue-500" : "bg-amber-500"}`}
                          style={{ width: `${(s.grade / s.maxGrade) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors" style={{ fontWeight: 500 }}>
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    {s.feedback && (
                      <button
                        onClick={() => setActiveId(activeId === s.id ? null : s.id)}
                        className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> {activeId === s.id ? "Hide Feedback" : "View Feedback"}
                      </button>
                    )}
                  </div>

                  {/* Feedback panel */}
                  {activeId === s.id && s.feedback && (
                    <div className="mt-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-blue-600 fill-blue-200" />
                        <span className="text-blue-700 text-sm" style={{ fontWeight: 600 }}>Instructor Feedback</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{s.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
