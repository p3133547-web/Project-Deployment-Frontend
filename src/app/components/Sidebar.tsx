import { NavLink, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, BookOpen, BarChart2, CalendarDays,
  Inbox, Bot, LogOut, Settings, GraduationCap, X, ChevronRight,
  ClipboardCheck, FileText, TrendingUp, Bell, Code2,
  Ticket, Briefcase, Download, User, Shield,
} from "lucide-react";
import { useAuth, Role } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type NavItem = { label: string; icon: React.ElementType; path: string; badge?: number };

// ── Student nav ─────────────────────────────────────────────────────────────
const studentNav: NavItem[] = [
  { label: "Dashboard",       icon: LayoutDashboard, path: "/" },
  { label: "Attendance",      icon: ClipboardCheck,  path: "/attendance" },
  { label: "Marks & Results", icon: BookOpen,        path: "/marks" },
  { label: "Assignments",     icon: FileText,        path: "/assignments" },
  { label: "Analytics",       icon: TrendingUp,      path: "/analytics" },
  { label: "Timetable",       icon: CalendarDays,    path: "/timetable" },
  { label: "Inbox",           icon: Inbox,           path: "/inbox", badge: 3 },
  { label: "Hall Ticket",     icon: Ticket,          path: "/hall-ticket" },
  { label: "Internships",     icon: Briefcase,       path: "/internships" },
  { label: "GoCode",          icon: Code2,           path: "/gocode" },
  { label: "AI Chatbot",      icon: Bot,             path: "/chatbot" },
];

const studentAccountNav: NavItem[] = [
  { label: "Reports",  icon: Download, path: "/reports" },
  { label: "Profile",  icon: User,     path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

// ── Staff nav ──────────────────────────────────────────────────────────────
const staffNav: NavItem[] = [
  { label: "Dashboard",     icon: LayoutDashboard, path: "/" },
  { label: "Attendance",    icon: ClipboardCheck,  path: "/attendance" },
  { label: "Marks Entry",   icon: FileText,        path: "/marks" },
  { label: "Assignments",   icon: BookOpen,        path: "/assignments" },
  { label: "Announcements", icon: Bell,            path: "/announcements" },
  { label: "Leave & OD",    icon: CalendarDays,    path: "/leave" },
  { label: "Reports",       icon: BarChart2,       path: "/analytics" },
  { label: "Office",        icon: Shield,          path: "/office" },
  { label: "AI Chatbot",    icon: Bot,             path: "/chatbot" },
];

const staffAccountNav: NavItem[] = [
  { label: "Profile",  icon: User,     path: "/staff-profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const navByRole: Record<Role, { main: NavItem[]; account: NavItem[] }> = {
  student: { main: studentNav,   account: studentAccountNav },
  staff:   { main: staffNav,     account: staffAccountNav },
  admin:   { main: staffNav,     account: staffAccountNav }, // admin redirected to staff portal
};

const roleColor: Record<Role, string> = {
  student: "bg-blue-600",
  staff:   "bg-violet-600",
  admin:   "bg-violet-600",
};

const roleBanner: Record<Role, { from: string; to: string; label: string; sub: string }> = {
  student: { from: "from-blue-600",   to: "to-indigo-700",  label: "Semester Progress", sub: "Spring 2026 · Week 14/16" },
  staff:   { from: "from-violet-600", to: "to-violet-700",  label: "Active Classes",    sub: "3 courses · 167 students" },
  admin:   { from: "from-violet-600", to: "to-violet-700",  label: "Active Classes",    sub: "3 courses · 167 students" },
};

interface SidebarProps { open: boolean; onClose: () => void; }

export function Sidebar({ open, onClose }: SidebarProps) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const role      = user?.role ?? "student";
  const { main: navItems, account: accountItems } = navByRole[role];
  const banner    = roleBanner[role];

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const NavListItem = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    return (
      <li>
        <NavLink
          to={item.path}
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            active
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <item.icon style={{ width: 17, height: 17 }} className="flex-shrink-0" />
          <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
          {item.badge && (
            <span
              className={`ml-auto text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}
              style={{ fontWeight: 700 }}
            >
              {item.badge}
            </span>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        style={{ backgroundColor: isDark ? "#0f172a" : "#0f172a" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-900">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm" style={{ fontWeight: 700 }}>IntelliCampus</p>
              <p className="text-slate-400 text-xs">Academic System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800 cursor-pointer transition-colors hover:bg-slate-750">
            <div
              className={`w-9 h-9 rounded-full ${roleColor[role]} flex items-center justify-center text-white text-sm flex-shrink-0`}
              style={{ fontWeight: 700 }}
            >
              {user?.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate" style={{ fontWeight: 500 }}>{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.designation}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-none">
          <p className="text-slate-500 text-xs px-3 mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Navigation
          </p>
          <ul className="space-y-0.5">
            {navItems.map(item => <NavListItem key={item.path} item={item} />)}
          </ul>

          {/* Account section */}
          <p className="text-slate-500 text-xs px-3 mb-2 mt-5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Account
          </p>
          <ul className="space-y-0.5">
            {accountItems.map(item => <NavListItem key={item.path} item={item} />)}
            <li>
              <button
                id="sidebar-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
              >
                <LogOut style={{ width: 17, height: 17 }} className="flex-shrink-0" /> Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Progress banner */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className={`rounded-xl bg-gradient-to-br ${banner.from} ${banner.to} p-4`}>
            <p className="text-white text-sm" style={{ fontWeight: 600 }}>{banner.label}</p>
            <p className="text-white/70 text-xs mt-0.5">{banner.sub}</p>
            {role === "student" && (
              <>
                <div className="mt-3 bg-white/20 rounded-full h-1.5">
                  <div className="bg-white rounded-full h-1.5" style={{ width: "87.5%" }} />
                </div>
                <p className="text-white/60 text-xs mt-1">87.5% complete</p>
              </>
            )}
            {role === "staff" && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 bg-violet-200 rounded-full animate-pulse" />
                <span className="text-white/70 text-xs">3 active courses today</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
