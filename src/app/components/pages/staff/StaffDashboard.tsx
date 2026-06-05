import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, BookOpen, Clock, TrendingUp, AlertCircle, CheckCircle2, Calendar, FileText, Bell } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { 
  attendanceApi, SubjectOut, 
  leaveApi, LeaveOut, 
  assignmentsApi, AssignmentOut, 
  announcementsApi, AnnouncementOut 
} from "@/lib/api";

const attendanceOverview = [
  { section: "III CSE A", pct: 87 },
  { section: "III CSE B", pct: 82 },
  { section: "III CSE A Lab", pct: 91 },
];

export function StaffDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  
  const [subjects, setSubjects] = useState<SubjectOut[]>([]);
  const [pendingLeave, setPendingLeave] = useState<LeaveOut[]>([]);
  const [assignments, setAssignments] = useState<AssignmentOut[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementOut[]>([]);

  useEffect(() => {
    Promise.all([
      attendanceApi.getSubjects({ department: user?.department }),
      leaveApi.getPending(),
      assignmentsApi.getAll(),
      announcementsApi.getAll()
    ]).then(([subRes, leaveRes, assignRes, annRes]) => {
      setSubjects(subRes.data);
      setPendingLeave(leaveRes.data);
      setAssignments(assignRes.data);
      setAnnouncements(annRes.data.slice(0, 4));
    }).catch(console.error);
  }, [user]);

  const recentActivity = announcements.map((a, i) => ({
    id: a.id,
    action: `New announcement: ${a.title}`,
    time: new Date(a.created_at).toLocaleDateString(),
    icon: Bell,
    color: "text-blue-500"
  }));

  const pendingTasks = pendingLeave.map((l, i) => ({
    id: l.id,
    task: `Leave request from ${l.student_id ? l.student_id.slice(0, 8) : "student"}`,
    due: "Pending Review",
    urgent: true,
    type: "leave",
    icon: AlertCircle,
    color: "text-red-500"
  }));

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200">
        <div className="relative z-10">
          <p className="text-violet-200 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h2 className="mt-1 text-white" style={{ fontSize: 22, fontWeight: 700 }}>Good morning, {user?.name?.split(" ").slice(0, 2).join(" ")}! 👋</h2>
          <p className="text-violet-100 text-sm mt-1">You have <strong>{pendingLeave.length} pending leave requests</strong> and <strong>{subjects.length} active classes</strong>.</p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link to="/attendance" className="inline-flex items-center gap-1.5 bg-white text-violet-700 text-sm px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors" style={{ fontWeight: 500 }}>
              Mark Attendance
            </Link>
            <Link to="/leave" className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm px-4 py-2 rounded-xl hover:bg-white/25 border border-white/20 transition-colors" style={{ fontWeight: 500 }}>
              Review Leave
            </Link>
          </div>
        </div>
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 right-12 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Classes",        value: subjects.length.toString(),     sub: "Assigned subjects",  icon: BookOpen, bg: "bg-violet-50", color: "text-violet-600" },
          { label: "Active Assignments",value: assignments.length.toString(),  sub: "Currently open",     icon: FileText, bg: "bg-blue-50",   color: "text-blue-600"   },
          { label: "Avg Attendance",    value: "86%",                          sub: "Across all classes", icon: TrendingUp, bg: "bg-orange-50", color: "text-orange-500" },
          { label: "Pending Leave",     value: pendingLeave.length.toString(), sub: "To review",          icon: Clock, bg: "bg-red-50", color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: textPri }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ fontWeight: 500, color: textMed }}>{s.label}</p>
            <p className="text-xs" style={{ color: textSub }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's classes */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${border}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-violet-600" /></div>
              <div>
                <h3 style={{ fontWeight: 600, color: textPri }}>Assigned Subjects</h3>
                <p className="text-xs" style={{ color: textSub }}>Current Semester</p>
              </div>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {subjects.length === 0 && <p className="text-slate-400 text-sm">No assigned subjects.</p>}
            {subjects.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl transition-all"
                style={{ border: `1px solid ${border}` }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = isDark ? "#6d28d9" : "#ddd6fe")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = border)}>
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: textSub }}>{c.code} · Sem {c.semester}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm" style={{ fontWeight: 600, color: textMed }}>{c.credits} Credits</p>
                  <p className="text-xs" style={{ color: textSub }}>{c.is_lab ? "Lab" : "Theory"}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance chart */}
          <div className="px-5 pb-5">
            <p className="text-slate-600 text-xs mb-3" style={{ fontWeight: 600 }}>Class Attendance Overview</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={attendanceOverview} margin={{ top: 0, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="section" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f8fafc", fontSize: 11 }} />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {attendanceOverview.map((a, i) => <Cell key={i} fill={a.pct >= 85 ? "#8b5cf6" : "#f97316"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending tasks + recent activity */}
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-red-500" /></div>
                <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>Pending Review</p>
              </div>
              {pendingLeave.length > 0 && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-lg" style={{ fontWeight: 600 }}>{pendingLeave.length} Leaves</span>}
            </div>
            <div className="divide-y divide-slate-50">
              {pendingTasks.length === 0 && <p className="px-4 py-3 text-slate-400 text-xs">No pending items.</p>}
              {pendingTasks.map(t => (
                <div key={t.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                  <t.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 text-xs leading-snug" style={{ fontWeight: t.urgent ? 600 : 400 }}>{t.task}</p>
                    <p className="text-slate-400 text-xs mt-0.5">Status: {t.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${border}` }}>
              <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>Recent Announcements</p>
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.length === 0 && <p className="px-4 py-3 text-slate-400 text-xs">No recent activity.</p>}
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <a.icon className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${a.color}`} />
                  <div>
                    <p className="text-slate-600 text-xs leading-snug">{a.action}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{a.time}</p>
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
