import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Circle,
  ChevronDown,
  FileText,
  Upload,
  Eye,
  BookOpen,
  Calendar,
} from "lucide-react";

const allAssignments = [
  {
    id: 1,
    title: "Binary Trees Implementation",
    course: "CS301",
    subject: "Data Structures",
    due: "Apr 10, 2026",
    daysLeft: 1,
    status: "pending",
    priority: "high",
    type: "Coding",
    points: 100,
    completion: 60,
    description: "Implement binary search tree with insert, delete, and traversal algorithms.",
  },
  {
    id: 2,
    title: "Model Evaluation Report",
    course: "CS445",
    subject: "Machine Learning",
    due: "Apr 13, 2026",
    daysLeft: 4,
    status: "in-progress",
    priority: "medium",
    type: "Report",
    points: 80,
    completion: 35,
    description: "Evaluate ML models using precision, recall, F1-score, and ROC-AUC metrics.",
  },
  {
    id: 3,
    title: "Process Scheduling Lab",
    course: "CS330",
    subject: "Operating Systems",
    due: "Apr 17, 2026",
    daysLeft: 8,
    status: "pending",
    priority: "low",
    type: "Lab",
    points: 60,
    completion: 0,
    description: "Simulate FCFS, SJF, and Round Robin scheduling algorithms in C.",
  },
  {
    id: 4,
    title: "Database Normalization",
    course: "CS360",
    subject: "Database Systems",
    due: "Apr 5, 2026",
    daysLeft: -4,
    status: "submitted",
    priority: "high",
    type: "Assignment",
    points: 90,
    completion: 100,
    description: "Normalize a given schema to 3NF and BCNF, with ER diagrams.",
  },
  {
    id: 5,
    title: "React Final Project",
    course: "CS410",
    subject: "Web Development",
    due: "Apr 22, 2026",
    daysLeft: 13,
    status: "in-progress",
    priority: "medium",
    type: "Project",
    points: 150,
    completion: 20,
    description: "Build a full-stack React application with REST API integration.",
  },
  {
    id: 6,
    title: "Network Protocols Quiz",
    course: "CS420",
    subject: "Computer Networks",
    due: "Mar 28, 2026",
    daysLeft: -12,
    status: "graded",
    priority: "high",
    type: "Quiz",
    points: 40,
    completion: 100,
    description: "Online quiz covering TCP/IP, HTTP, DNS, and routing protocols.",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  pending: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <Clock className="w-3.5 h-3.5" /> },
  "in-progress": { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: <Circle className="w-3.5 h-3.5 fill-blue-200" /> },
  submitted: { label: "Submitted", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  graded: { label: "Graded", color: "text-violet-700", bg: "bg-violet-50 border-violet-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
};

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const typeColors: Record<string, string> = {
  Coding: "text-blue-600 bg-blue-50",
  Report: "text-violet-600 bg-violet-50",
  Lab: "text-emerald-600 bg-emerald-50",
  Assignment: "text-slate-600 bg-slate-100",
  Project: "text-orange-600 bg-orange-50",
  Quiz: "text-red-600 bg-red-50",
};

export function Assignments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filters = ["all", "pending", "in-progress", "submitted", "graded"];

  const filtered = allAssignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.course.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: allAssignments.length, color: "text-slate-700", bg: "bg-slate-100" },
          { label: "Pending", value: allAssignments.filter(a => a.status === "pending").length, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "In Progress", value: allAssignments.filter(a => a.status === "in-progress").length, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Completed", value: allAssignments.filter(a => ["submitted", "graded"].includes(a.status)).length, color: "text-emerald-700", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white`}>
            <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</p>
            <p className={`text-sm ${s.color} opacity-80`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assignments, courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm transition-colors capitalize ${
                  statusFilter === f
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                style={{ fontWeight: 500 }}
              >
                {f === "all" ? "All" : f.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No assignments found</p>
          </div>
        ) : (
          filtered.map((a) => {
            const s = statusConfig[a.status];
            const isOpen = expanded === a.id;
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                  onClick={() => setExpanded(isOpen ? null : a.id)}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[a.priority]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md" style={{ fontWeight: 500 }}>{a.course}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${typeColors[a.type]}`} style={{ fontWeight: 500 }}>{a.type}</span>
                    </div>
                    <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{a.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{a.subject}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {a.due}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border ${s.bg} ${s.color}`} style={{ fontWeight: 500 }}>
                      {s.icon} {s.label}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Progress bar */}
                {(a.status === "pending" || a.status === "in-progress") && (
                  <div className="px-5 pb-3">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.completion}%` }} />
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{a.completion}% complete · {a.points} pts</p>
                  </div>
                )}

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50">
                    <p className="text-slate-600 text-sm mb-4">{a.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(a.status === "pending" || a.status === "in-progress") && (
                        <>
                          <button className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors" style={{ fontWeight: 500 }}>
                            <Upload className="w-4 h-4" /> Submit Assignment
                          </button>
                          <button className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                        </>
                      )}
                      {(a.status === "submitted" || a.status === "graded") && (
                        <button className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
                          <Eye className="w-4 h-4" /> View Submission
                        </button>
                      )}
                      <button className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                        <BookOpen className="w-4 h-4" /> Course Materials
                      </button>
                    </div>
                    {a.daysLeft > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-slate-500">Due in <strong>{a.daysLeft} days</strong> · Worth <strong>{a.points} points</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
