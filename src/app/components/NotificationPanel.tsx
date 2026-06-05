import { useEffect, useRef, useState } from "react";
import { Bell, X, CheckCheck, Info, AlertTriangle, BookOpen, CalendarDays, FileText } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "warning" | "assignment" | "attendance" | "announcement";
  title: string;
  body: string;
  time: string;
  read: boolean;
  group: "today" | "earlier";
}

const ICON_MAP = {
  info:         { icon: Info,          bg: "bg-blue-100 dark:bg-blue-900/40",       text: "text-blue-600 dark:text-blue-400" },
  warning:      { icon: AlertTriangle, bg: "bg-amber-100 dark:bg-amber-900/40",     text: "text-amber-600 dark:text-amber-400" },
  assignment:   { icon: FileText,      bg: "bg-indigo-100 dark:bg-indigo-900/40",   text: "text-indigo-600 dark:text-indigo-400" },
  attendance:   { icon: CalendarDays,  bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400" },
  announcement: { icon: BookOpen,      bg: "bg-violet-100 dark:bg-violet-900/40",   text: "text-violet-600 dark:text-violet-400" },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "attendance",
    title: "Low Attendance Alert",
    body: "Your attendance in Data Structures has dropped below 75%. Attend at least 3 upcoming classes.",
    time: "9 min ago",
    read: false,
    group: "today",
  },
  {
    id: "2",
    type: "assignment",
    title: "Assignment Due Tomorrow",
    body: "Operating Systems Lab Report is due on 12 Apr, 11:59 PM. Submit via portal.",
    time: "1 hr ago",
    read: false,
    group: "today",
  },
  {
    id: "3",
    type: "announcement",
    title: "Semester End Exam Schedule",
    body: "The April 2026 semester end exam schedule has been published. Check the Timetable section.",
    time: "3 hrs ago",
    read: false,
    group: "today",
  },
  {
    id: "4",
    type: "info",
    title: "Hall Ticket Available",
    body: "Your hall ticket for April 2026 exams is now ready. Download from the Hall Ticket section.",
    time: "Yesterday",
    read: true,
    group: "earlier",
  },
  {
    id: "5",
    type: "warning",
    title: "Fee Payment Reminder",
    body: "Semester fee payment deadline is April 20, 2026. Unpaid fees may affect exam eligibility.",
    time: "2 days ago",
    read: true,
    group: "earlier",
  },
  {
    id: "6",
    type: "announcement",
    title: "Guest Lecture: AI in Healthcare",
    body: "A guest lecture is scheduled on April 15 at 10:00 AM in CS Seminar Hall. Registration open.",
    time: "3 days ago",
    read: true,
    group: "earlier",
  },
];

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const todayItems    = notifications.filter(n => n.group === "today");
  const earlierItems  = notifications.filter(n => n.group === "earlier");

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          absolute right-0 top-full mt-2 z-50
          w-[340px] sm:w-[380px]
          bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-700
          rounded-2xl shadow-2xl shadow-slate-900/15
          flex flex-col overflow-hidden
          transition-all duration-200 origin-top-right
          ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            <span className="text-slate-800 dark:text-slate-100 text-sm font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 scrollbar-none">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
              <Bell className="w-10 h-10 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <>
              {todayItems.length > 0 && (
                <NotifGroup label="Today" items={todayItems} markRead={markRead} dismiss={dismiss} />
              )}
              {earlierItems.length > 0 && (
                <NotifGroup label="Earlier" items={earlierItems} markRead={markRead} dismiss={dismiss} />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}

function NotifGroup({
  label, items, markRead, dismiss
}: {
  label: string;
  items: Notification[];
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
}) {
  return (
    <div>
      <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {label}
      </p>
      {items.map(n => <NotifItem key={n.id} n={n} markRead={markRead} dismiss={dismiss} />)}
    </div>
  );
}

function NotifItem({
  n, markRead, dismiss
}: {
  n: Notification;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
}) {
  const { icon: Icon, bg, text } = ICON_MAP[n.type];

  return (
    <div
      onClick={() => markRead(n.id)}
      className={`
        group relative flex gap-3 px-4 py-3 cursor-pointer
        transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60
        ${!n.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}
        border-b border-slate-100 dark:border-slate-800/60 last:border-0
      `}
    >
      {/* Unread dot */}
      {!n.read && (
        <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
      )}

      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${text}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-tight mb-0.5 ${!n.read ? "font-semibold text-slate-800 dark:text-slate-100" : "font-medium text-slate-700 dark:text-slate-300"}`}>
          {n.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">{n.body}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
      </div>

      {/* Dismiss btn */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
        className="opacity-0 group-hover:opacity-100 absolute right-1 top-1 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Bell button with badge (exported separately for use in topbar)
export function NotificationBell({ onClick }: { onClick: () => void; unreadCount: number }) {
  const [notifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const count = notifications.filter(n => !n.read).length;

  return (
    <button
      id="notification-bell"
      onClick={onClick}
      className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">{count}</span>
        </span>
      )}
    </button>
  );
}
