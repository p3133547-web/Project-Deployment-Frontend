import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  TrendingUp, Clock, Bell, BookOpen, Award, Flame, Users,
  ChevronRight, AlertCircle, CheckCircle2, Circle, ArrowUpRight,
  CalendarDays, FileText, Percent,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { attendanceApi, announcementsApi, marksApi, AttendanceSummary, AnnouncementOut, CGPASummary } from "@/lib/api";

const cgpaData = [
  { sem: "S1", cgpa: 7.8 }, { sem: "S2", cgpa: 8.1 }, { sem: "S3", cgpa: 8.0 },
  { sem: "S4", cgpa: 8.3 },
];

const timetableToday = [
  { time: "09:00", sub: "Data Structures Lab", room: "Lab 2", type: "lab" },
  { time: "11:00", sub: "Machine Learning", room: "Block A - 301", type: "theory" },
  { time: "14:00", sub: "Web Technologies", room: "Block A - 205", type: "theory" },
  { time: "15:00", sub: "Computer Networks", room: "Block B - 101", type: "theory" },
];

export function StudentDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const firstName = user?.name?.split(" ")[0] ?? "Student";

  const card   = isDark ? "#1e293b" : "#ffffff";
  const border = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const hoverBg = isDark ? "rgba(255,255,255,0.03)" : "#f8fafc";

  // Live API data
  const [liveAttendance, setLiveAttendance] = useState<AttendanceSummary[]>([]);
  const [liveAnnouncements, setLiveAnnouncements] = useState<AnnouncementOut[]>([]);
  const [liveCgpa, setLiveCgpa] = useState<CGPASummary | null>(null);

  useEffect(() => {
    attendanceApi.getMySummary().then((r) => setLiveAttendance(r.data)).catch(() => {});
    announcementsApi.getAll().then((r) => setLiveAnnouncements(r.data)).catch(() => {});
    marksApi.getMyCGPA().then((r) => setLiveCgpa(r.data)).catch(() => {});
  }, []);

  const displayAttendance = liveAttendance.length > 0
    ? liveAttendance.map((s) => ({ sub: s.subject_name, code: s.subject_code, pct: s.percentage, classes: s.total_classes, present: s.attended }))
    : [];

  const displayAnnouncements = liveAnnouncements.length > 0
    ? liveAnnouncements.map((a, i) => ({ id: a.id, title: a.title, time: new Date(a.created_at).toLocaleDateString(), urgent: a.is_pinned }))
    : [];

  const cgpaDisplay = liveCgpa ? liveCgpa.cgpa.toFixed(2) : "—";
  const overallAttendance = displayAttendance.length > 0
    ? Math.round(displayAttendance.reduce((a, s) => a + s.pct, 0) / displayAttendance.length)
    : 0;

  const cgpaHistory = [
    { sem: "S1", cgpa: 7.8 }, { sem: "S2", cgpa: 8.1 }, { sem: "S3", cgpa: 8.0 },
    { sem: "S4", cgpa: 8.3 },
    ...(liveCgpa ? [{ sem: "S5", cgpa: liveCgpa.cgpa }] : [{ sem: "S5", cgpa: 8.7 }]),
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-6 text-white shadow-lg shadow-indigo-200">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm">Saturday, April 11, 2026 · Spring Semester</p>
          <h2 className="mt-1 text-white" style={{ fontSize: 22, fontWeight: 700 }}>Good morning, {firstName}! 👋</h2>
          <p className="text-indigo-100 text-sm mt-1">
            You have <strong>1 urgent deadline</strong> today and <strong>4 upcoming announcements</strong>. Stay on track!
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link to="/attendance" className="inline-flex items-center gap-1.5 bg-white text-indigo-700 text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors" style={{ fontWeight: 500 }}>
              Check Attendance <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/marks" className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm px-4 py-2 rounded-xl hover:bg-white/25 border border-white/20 transition-colors" style={{ fontWeight: 500 }}>
              View Marks
            </Link>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -right-4 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-6 right-28 w-16 h-16 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CGPA", value: cgpaDisplay, sub: "Live from records", icon: Award, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Attendance", value: overallAttendance > 0 ? `${overallAttendance}%` : "—", sub: "≥75% required", icon: Percent, bg: "bg-orange-50", color: "text-orange-500" },
          { label: "Assignments", value: "7 / 9", sub: "2 pending", icon: FileText, bg: "bg-violet-50", color: "text-violet-600" },
          { label: "Class Rank", value: "#12", sub: "of 68 students", icon: Flame, bg: "bg-emerald-50", color: "text-emerald-600" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: textPri }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ fontWeight: 500, color: textMed }}>{s.label}</p>
            <p className="text-xs mt-0.5" style={{ color: textSub }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* CGPA Trend */}
        <div className="lg:col-span-2 rounded-2xl p-5 hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: textPri }}>CGPA Trend</h3>
                <p className="text-xs" style={{ color: textSub }}>Semester-wise performance</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg" style={{ fontWeight: 500 }}>8.4 Current</span>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={cgpaHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sem" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 10, color: "#f8fafc", fontSize: 12 }} />
              <Area type="monotone" dataKey="cgpa" stroke="#4f46e5" strokeWidth={2.5} fill="url(#cgpaGrad)" dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Timetable */}
        <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: textPri }}>Today's Classes</h3>
                <p className="text-xs" style={{ color: textSub }}>Saturday · Apr 11</p>
              </div>
            </div>
            <Link to="/timetable" className="text-indigo-600 text-xs flex items-center gap-0.5 hover:underline" style={{ fontWeight: 500 }}>
              Full <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {timetableToday.map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="text-center flex-shrink-0">
                  <p className="text-slate-600 text-xs" style={{ fontWeight: 600 }}>{c.time}</p>
                </div>
                <div className={`w-1 h-10 rounded-full flex-shrink-0 ${c.type === "lab" ? "bg-orange-400" : "bg-indigo-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm truncate" style={{ fontWeight: 500 }}>{c.sub}</p>
                  <p className="text-slate-400 text-xs">{c.room}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-lg flex-shrink-0 ${c.type === "lab" ? "bg-orange-50 text-orange-600" : "bg-indigo-50 text-indigo-600"}`} style={{ fontWeight: 500 }}>
                  {c.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance summary */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: textPri }}>Attendance Summary</h3>
                <p className="text-xs" style={{ color: textSub }}>Subject-wise breakdown</p>
              </div>
            </div>
            <Link to="/attendance" className="text-indigo-600 text-xs flex items-center gap-0.5 hover:underline" style={{ fontWeight: 500 }}>
              Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5 space-y-3.5">
            {displayAttendance.length > 0 ? displayAttendance.map((s) => (
              <div key={s.code}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{s.code}</span>
                    <p className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{s.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">{s.present}/{s.classes}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${s.pct < 75 ? "text-red-600 bg-red-50" : s.pct >= 85 ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50"}`} style={{ fontWeight: 600 }}>
                      {s.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${s.pct < 75 ? "bg-red-500" : s.pct >= 85 ? "bg-emerald-500" : "bg-orange-500"}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-4">No attendance data yet — check back after classes!</p>
            )}
          </div>
        </div>

        {/* Deadlines + Announcements */}
        <div className="space-y-5">
          {/* Deadlines */}
          <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                </div>
                <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>Deadlines</p>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { title: "Data Structures Lab Report", due: "Apr 12", daysLeft: 1, status: "urgent" },
                { title: "Web Tech Mini Project", due: "Apr 16", daysLeft: 5, status: "medium" },
                { title: "ML Assignment #3", due: "Apr 20", daysLeft: 9, status: "low" },
              ].map((d, i) => (
                <div key={i} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-700 text-xs leading-snug" style={{ fontWeight: 500 }}>{d.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-lg flex-shrink-0 ${d.status === "urgent" ? "bg-red-50 text-red-600" : d.status === "medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`} style={{ fontWeight: 600 }}>
                      {d.daysLeft === 1 ? "Tomorrow" : `${d.daysLeft}d`}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">Due {d.due}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>Announcements</p>
              </div>
              <Link to="/inbox" className="text-indigo-600 text-xs hover:underline" style={{ fontWeight: 500 }}>All</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {(displayAnnouncements.length > 0 ? displayAnnouncements : [
                { id: "1", title: "Internal Assessment Results Published", time: "Recent", urgent: true },
                { id: "2", title: "Guest Lecture: AI in Industry — Apr 15", time: "Recent", urgent: false },
                { id: "3", title: "TCS Placement Drive — Apr 22, Register Now", time: "Recent", urgent: false },
              ]).slice(0, 3).map((a) => (
                <div key={a.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-2">
                    {a.urgent ? <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5 fill-blue-100" />}
                    <div>
                      <p className="text-slate-700 text-xs leading-snug" style={{ fontWeight: 500 }}>{a.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
