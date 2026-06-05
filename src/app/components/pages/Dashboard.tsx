import { Link } from "react-router";
import React from "react";
import {
  Clock,
  BookOpen,
  Bell,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  CalendarDays,
  FileText,
  Award,
  Users,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const deadlines = [
  { id: 1, subject: "Data Structures", title: "Binary Trees Implementation", due: "Apr 10, 2026", daysLeft: 1, priority: "high", course: "CS301" },
  { id: 2, subject: "Machine Learning", title: "Model Evaluation Report", due: "Apr 13, 2026", daysLeft: 4, priority: "medium", course: "CS445" },
  { id: 3, subject: "Operating Systems", title: "Process Scheduling Lab", due: "Apr 17, 2026", daysLeft: 8, priority: "low", course: "CS330" },
  { id: 4, subject: "Web Development", title: "React Final Project", due: "Apr 22, 2026", daysLeft: 13, priority: "low", course: "CS410" },
];

const notifications = [
  { id: 1, type: "alert", message: "Assignment graded: Database Normalization — Grade: A", time: "10 min ago", read: false },
  { id: 2, type: "info", message: "New material uploaded in Machine Learning course", time: "1 hr ago", read: false },
  { id: 3, type: "success", message: "Lab submission confirmed for OS Process Scheduling", time: "3 hrs ago", read: true },
  { id: 4, type: "alert", message: "Reminder: Quiz on Network Protocols tomorrow at 9 AM", time: "5 hrs ago", read: false },
];

const subjects = [
  { name: "Data Structures", grade: 92, assignments: 8, completed: 7, color: "bg-blue-500" },
  { name: "Machine Learning", grade: 87, assignments: 6, completed: 5, color: "bg-violet-500" },
  { name: "Operating Systems", grade: 79, assignments: 7, completed: 6, color: "bg-emerald-500" },
  { name: "Web Development", grade: 95, assignments: 5, completed: 5, color: "bg-amber-500" },
];

const progressData = [
  { week: "W10", grade: 78 },
  { week: "W11", grade: 82 },
  { week: "W12", grade: 79 },
  { week: "W13", grade: 88 },
  { week: "W14", grade: 90 },
];

const stats = [
  { label: "GPA", value: "3.8", sub: "+0.2 this sem", icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Assignments", value: "23/26", sub: "3 pending", icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Streak", value: "14 days", sub: "Personal best!", icon: Flame, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Classmates", value: "142", sub: "Active today", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const priorityColors: Record<string, string> = {
  high: "text-red-600 bg-red-50 border-red-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  low: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const notifIcons: Record<string, JSX.Element> = {
  alert: <AlertCircle className="w-4 h-4 text-amber-500" />,
  info: <Circle className="w-4 h-4 text-blue-500 fill-blue-100" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};

export function Dashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 text-white shadow-lg shadow-blue-200">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm">Thursday, April 9, 2026</p>
          <h2 className="mt-1 text-white" style={{ fontSize: 22, fontWeight: 600 }}>Good morning, Alex! 👋</h2>
          <p className="text-blue-100 text-sm mt-1">You have 3 pending assignments and 1 due tomorrow. Stay on track!</p>
          <div className="flex gap-3 mt-4">
            <Link to="/assignments" className="inline-flex items-center gap-1.5 bg-white text-blue-700 text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors" style={{ fontWeight: 500 }}>
              View Assignments <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/chatbot" className="inline-flex items-center gap-1.5 bg-white/15 text-white text-sm px-4 py-2 rounded-xl hover:bg-white/25 transition-colors border border-white/20" style={{ fontWeight: 500 }}>
              Ask AI Assistant
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-slate-800" style={{ fontSize: 22, fontWeight: 600 }}>{value}</p>
            <p className="text-slate-500 text-xs mt-0.5" style={{ fontWeight: 500 }}>{label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Upcoming Deadlines</h3>
                <p className="text-slate-400 text-xs">Next 2 weeks</p>
              </div>
            </div>
            <Link to="/assignments" className="text-blue-600 text-xs flex items-center gap-1 hover:underline" style={{ fontWeight: 500 }}>
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {deadlines.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[item.priority]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded-md">{item.course}</span>
                    <p className="text-slate-700 text-sm truncate" style={{ fontWeight: 500 }}>{item.title}</p>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{item.subject}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border ${priorityColors[item.priority]}`} style={{ fontWeight: 500 }}>
                    {item.daysLeft === 1 ? "Tomorrow!" : `${item.daysLeft} days`}
                  </span>
                  <p className="text-slate-400 text-xs mt-0.5">{item.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Notifications</h3>
                <p className="text-slate-400 text-xs">3 unread</p>
              </div>
            </div>
            <Link to="/notifications" className="text-blue-600 text-xs flex items-center gap-1 hover:underline" style={{ fontWeight: 500 }}>
              All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
                <div className="mt-0.5 flex-shrink-0">{notifIcons[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-xs leading-relaxed">{n.message}</p>
                  <p className="text-slate-400 text-xs mt-1">{n.time}</p>
                </div>
                {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Grade Trend</h3>
                <p className="text-slate-400 text-xs">Last 5 weeks average</p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg" style={{ fontWeight: 500 }}>▲ +12% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "none", borderRadius: 10, color: "#f8fafc", fontSize: 12 }}
                cursor={{ stroke: "#2563eb", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="grade" stroke="#2563eb" strokeWidth={2.5} fill="url(#gradeGrad)" dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Subject Progress</h3>
              <p className="text-slate-400 text-xs">Assignments completed</p>
            </div>
          </div>
          <div className="space-y-4">
            {subjects.map((sub) => (
              <div key={sub.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-slate-700 text-sm truncate pr-2" style={{ fontWeight: 500 }}>{sub.name}</p>
                  <span className="text-slate-500 text-xs flex-shrink-0">{sub.completed}/{sub.assignments}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${sub.color} transition-all duration-500`}
                    style={{ width: `${(sub.completed / sub.assignments) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-slate-400 text-xs">{Math.round((sub.completed / sub.assignments) * 100)}% done</p>
                  <p className="text-slate-500 text-xs" style={{ fontWeight: 500 }}>Grade: {sub.grade}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Assignments summary */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Pending Assignments</h3>
              <p className="text-slate-400 text-xs">3 tasks need your attention</p>
            </div>
          </div>
          <Link to="/assignments" className="text-blue-600 text-xs flex items-center gap-1 hover:underline" style={{ fontWeight: 500 }}>
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Binary Trees Implementation", course: "CS301 · Data Structures", due: "Apr 10", status: "Urgent", statusColor: "text-red-600 bg-red-50", completion: 60 },
            { title: "Model Evaluation Report", course: "CS445 · Machine Learning", due: "Apr 13", status: "In Progress", statusColor: "text-amber-600 bg-amber-50", completion: 35 },
            { title: "Process Scheduling Lab", course: "CS330 · Operating Systems", due: "Apr 17", status: "Not Started", statusColor: "text-slate-500 bg-slate-100", completion: 0 },
          ].map((a) => (
            <div key={a.title} className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-slate-700 text-sm leading-tight" style={{ fontWeight: 500 }}>{a.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-lg flex-shrink-0 ${a.statusColor}`} style={{ fontWeight: 500 }}>{a.status}</span>
              </div>
              <p className="text-slate-400 text-xs mb-3">{a.course} · Due {a.due}</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${a.completion}%` }} />
              </div>
              <p className="text-slate-400 text-xs mt-1">{a.completion}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}