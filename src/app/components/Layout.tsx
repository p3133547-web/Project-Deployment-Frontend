import { useState, useRef } from "react";
import { Outlet, useLocation, Navigate } from "react-router";
import { Sidebar } from "./Sidebar";
import { FloatingChatbot } from "./FloatingChatbot";
import { Menu, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { NotificationPanel } from "./NotificationPanel";
import { Bell } from "lucide-react";

const studentTitles: Record<string, { title: string; sub: string }> = {
  "/":             { title: "Dashboard",           sub: "Your academic overview at a glance." },
  "/attendance":   { title: "Attendance",          sub: "Track subject-wise attendance and apply for leave." },
  "/marks":        { title: "Marks & Results",     sub: "View internal marks, CGPA, and academic records." },
  "/assignments":  { title: "Assignments & Notes", sub: "View, submit assignments and download study materials." },
  "/analytics":    { title: "Analytics",           sub: "Performance charts and comparative insights." },
  "/timetable":    { title: "Timetable",           sub: "Your weekly class schedule." },
  "/inbox":        { title: "Inbox",               sub: "Announcements, circulars, and notifications." },
  "/hall-ticket":  { title: "Hall Ticket",         sub: "Exam registration, eligibility check, and hall ticket download." },
  "/internships":  { title: "Internships",         sub: "Browse openings, track applications, and upload reports." },
  "/reports":      { title: "Reports",             sub: "Download official academic reports as PDF documents." },
  "/gocode":       { title: "GoCode",              sub: "Coding practice tracks, daily challenges, and leaderboard." },
  "/profile":      { title: "My Profile",          sub: "Manage personal information and academic documents." },
  "/chatbot":      { title: "AI Assistant",        sub: "Ask academic questions and get instant answers." },
  "/settings":     { title: "Settings",            sub: "Manage your preferences, account, and notifications." },
};

const staffTitles: Record<string, { title: string; sub: string }> = {
  "/":              { title: "Faculty Dashboard",  sub: "Overview of your classes and pending tasks." },
  "/attendance":    { title: "Mark Attendance",    sub: "Record and edit student attendance for your classes." },
  "/marks":         { title: "Marks Entry",        sub: "Enter and manage student marks and evaluations." },
  "/assignments":   { title: "Assignments",        sub: "Upload materials, track submissions, and grade students." },
  "/announcements": { title: "Announcements",      sub: "Publish circulars and academic notifications to students." },
  "/leave":         { title: "Leave & OD",         sub: "Review student leave requests and manage your own leave." },
  "/analytics":     { title: "Reports",            sub: "Attendance and marks reports with analytics." },
  "/office":        { title: "Office Module",      sub: "Issue and collect student disciplinary IDs." },
  "/staff-profile": { title: "My Profile",         sub: "View and manage your faculty profile and teaching details." },
  "/chatbot":       { title: "AI Assistant",       sub: "AI-powered academic assistant for instant answers." },
  "/settings":      { title: "Settings",           sub: "Manage your preferences, account, and notifications." },
};

export function Layout() {
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [unreadCount]                     = useState(3);
  const notifRef                          = useRef<HTMLDivElement>(null);

  const location      = useLocation();
  const { user }      = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!user) return <Navigate to="/login" replace />;

  const titles    = user.role === "staff" ? staffTitles : studentTitles;
  const pageInfo  = titles[location.pathname] ?? { title: "IntelliCampus", sub: "" };
  const roleAccent = user.role === "staff" ? "bg-violet-600" : "bg-blue-600";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: isDark ? "#0f172a" : "#f8fafc",
      }}
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Topbar ── */}
        <header
          className="flex-shrink-0 border-b px-4 sm:px-6 py-3.5 flex items-center gap-4"
          style={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: isDark ? "#94a3b8" : "#475569" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="flex-1">
            <h1
              className="leading-tight"
              style={{ fontSize: 18, fontWeight: 700, color: isDark ? "#f1f5f9" : "#1e293b" }}
            >
              {pageInfo.title}
            </h1>
            <p
              className="text-xs hidden sm:block"
              style={{ color: isDark ? "#64748b" : "#94a3b8" }}
            >
              {pageInfo.sub}
            </p>
          </div>

          {/* Search bar */}
          <div
            className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-52"
            style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9" }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: isDark ? "#475569" : "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search…"
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
              style={{ color: isDark ? "#e2e8f0" : "#475569" }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setNotifOpen(o => !o)}
                className="relative p-2 rounded-xl transition-colors"
                style={{ color: isDark ? "#94a3b8" : "#475569" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#f1f5f9")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold" style={{ fontSize: 9 }}>{unreadCount}</span>
                  </span>
                )}
              </button>
              <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            {/* Dark mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ color: isDark ? "#94a3b8" : "#475569" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#334155" : "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Avatar */}
            <div
              className="flex items-center gap-2 pl-2 ml-1"
              style={{ borderLeft: `1px solid ${isDark ? "#334155" : "#e2e8f0"}` }}
            >
              <div
                className={`w-8 h-8 rounded-full ${roleAccent} flex items-center justify-center text-white text-xs`}
                style={{ fontWeight: 700 }}
              >
                {user.initials}
              </div>
              <div className="hidden sm:block">
                <p
                  className="leading-tight"
                  style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155" }}
                >
                  {user.name.split(" ")[0]}
                </p>
                <p style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8" }}>
                  {user.designation}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc" }}
        >
          <Outlet />
        </main>
      </div>

      {/* Floating chatbot – hidden on /chatbot page */}
      {location.pathname !== "/chatbot" && <FloatingChatbot />}
    </div>
  );
}
