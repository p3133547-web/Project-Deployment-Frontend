import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  Star,
  Trash2,
  Check,
  BookOpen,
  FileText,
  Award,
  MessageSquare,
  Calendar,
  Filter,
} from "lucide-react";

type NotifType = "grade" | "assignment" | "announcement" | "reminder" | "message" | "achievement";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  priority: "high" | "normal" | "low";
  course?: string;
}

const allNotifications: Notification[] = [
  {
    id: 1,
    type: "grade",
    title: "Assignment Graded",
    message: "Your 'Database Normalization' assignment has been graded. You scored 88/90 (A).",
    time: "10 min ago",
    date: "Today",
    read: false,
    priority: "normal",
    course: "CS360",
  },
  {
    id: 2,
    type: "reminder",
    title: "Deadline Tomorrow!",
    message: "Binary Trees Implementation is due tomorrow (Apr 10). Make sure to submit on time.",
    time: "1 hr ago",
    date: "Today",
    read: false,
    priority: "high",
    course: "CS301",
  },
  {
    id: 3,
    type: "announcement",
    title: "New Material Available",
    message: "Prof. Martinez uploaded new lecture slides for Machine Learning Week 13.",
    time: "3 hrs ago",
    date: "Today",
    read: false,
    priority: "normal",
    course: "CS445",
  },
  {
    id: 4,
    type: "reminder",
    title: "Quiz Tomorrow",
    message: "Network Protocols quiz is scheduled for tomorrow at 9:00 AM. Check the course portal.",
    time: "5 hrs ago",
    date: "Today",
    read: false,
    priority: "high",
    course: "CS420",
  },
  {
    id: 5,
    type: "achievement",
    title: "Achievement Unlocked! 🎉",
    message: "You earned the 'On Time Streak' badge for submitting 10 assignments before the deadline.",
    time: "Yesterday",
    date: "Yesterday",
    read: true,
    priority: "low",
  },
  {
    id: 6,
    type: "assignment",
    title: "New Assignment Posted",
    message: "Prof. Lee posted a new assignment: 'React Final Project' due Apr 22 in Web Development.",
    time: "2 days ago",
    date: "Apr 7",
    read: true,
    priority: "normal",
    course: "CS410",
  },
  {
    id: 7,
    type: "grade",
    title: "Quiz Result Posted",
    message: "Network Protocols Quiz score: 36/40 (A-). Review your answers in the course portal.",
    time: "2 days ago",
    date: "Apr 7",
    read: true,
    priority: "normal",
    course: "CS420",
  },
  {
    id: 8,
    type: "message",
    title: "Message from Prof. Williams",
    message: "Great work on the Shell Scripting submission. I'll review it by Friday. Keep it up!",
    time: "3 days ago",
    date: "Apr 6",
    read: true,
    priority: "normal",
    course: "CS330",
  },
  {
    id: 9,
    type: "announcement",
    title: "Office Hours Cancelled",
    message: "Dr. Chen's office hours on Apr 11 are cancelled. Email for alternative appointment times.",
    time: "4 days ago",
    date: "Apr 5",
    read: true,
    priority: "normal",
    course: "CS301",
  },
];

const typeConfig: Record<NotifType, { icon: JSX.Element; bg: string; color: string }> = {
  grade: { icon: <Star className="w-4 h-4" />, bg: "bg-amber-50", color: "text-amber-600" },
  assignment: { icon: <FileText className="w-4 h-4" />, bg: "bg-blue-50", color: "text-blue-600" },
  announcement: { icon: <BookOpen className="w-4 h-4" />, bg: "bg-violet-50", color: "text-violet-600" },
  reminder: { icon: <AlertCircle className="w-4 h-4" />, bg: "bg-red-50", color: "text-red-600" },
  message: { icon: <MessageSquare className="w-4 h-4" />, bg: "bg-emerald-50", color: "text-emerald-600" },
  achievement: { icon: <Award className="w-4 h-4" />, bg: "bg-orange-50", color: "text-orange-500" },
};

const filterOptions = ["all", "unread", "grade", "assignment", "reminder", "announcement", "message", "achievement"];

export function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: number) => setNotifications(notifications.filter((n) => n.id !== id));

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group by date
  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>All Notifications</p>
            <p className="text-slate-400 text-xs">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Check className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm capitalize transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            style={{ fontWeight: 500 }}
          >
            {f}
            {f === "unread" && unreadCount > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 rounded-full ${filter === f ? "bg-white/20 text-white" : "bg-red-500 text-white"}`} style={{ fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No notifications</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-slate-500" style={{ fontWeight: 600 }}>{date}</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <div className="space-y-2">
              {items.map((n) => {
                const { icon, bg, color } = typeConfig[n.type];
                return (
                  <div
                    key={n.id}
                    className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
                      !n.read ? "border-blue-200 shadow-sm shadow-blue-50" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
                        {icon}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-slate-800 text-sm" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                              {n.priority === "high" && (
                                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100" style={{ fontWeight: 600 }}>Urgent</span>
                              )}
                            </div>
                            {n.course && (
                              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-0.5">{n.course}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!n.read && (
                              <button
                                onClick={() => markRead(n.id)}
                                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotif(n.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">{n.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <p className="text-slate-400 text-xs">{n.time}</p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
