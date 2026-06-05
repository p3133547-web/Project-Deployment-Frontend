import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./components/pages/Login";
import { ChatbotPage } from "./components/pages/ChatbotPage";
import { Settings } from "./components/pages/Settings";

// Student pages
import { StudentDashboard }   from "./components/pages/student/StudentDashboard";
import { StudentAttendance }  from "./components/pages/student/StudentAttendance";
import { StudentMarks }       from "./components/pages/student/StudentMarks";
import { StudentAnalytics }   from "./components/pages/student/StudentAnalytics";
import { StudentTimetable }   from "./components/pages/student/StudentTimetable";
import { StudentInbox }       from "./components/pages/student/StudentInbox";
import { StudentAssignments } from "./components/pages/student/StudentAssignments";
import { StudentHallTicket }  from "./components/pages/student/StudentHallTicket";
import { StudentInternships } from "./components/pages/student/StudentInternships";
import { StudentReports }     from "./components/pages/student/StudentReports";
import { StudentGoCode }      from "./components/pages/student/StudentGoCode";
import { StudentProfile }     from "./components/pages/student/StudentProfile";

// Staff pages
import { StaffDashboard }     from "./components/pages/staff/StaffDashboard";
import { StaffAttendance }    from "./components/pages/staff/StaffAttendance";
import { StaffMarks }         from "./components/pages/staff/StaffMarks";
import { StaffReports }       from "./components/pages/staff/StaffReports";
import { StaffAnnouncements } from "./components/pages/staff/StaffAnnouncements";
import { StaffAssignments }   from "./components/pages/staff/StaffAssignments";
import { StaffLeave }         from "./components/pages/staff/StaffLeave";
import { StaffOffice }        from "./components/pages/staff/StaffOffice";
import { StaffProfile }       from "./components/pages/staff/StaffProfile";

import { useAuth } from "./context/AuthContext";

// ── Role-aware page wrappers ───────────────────────────────────────────────

function DashboardPage() {
  const { user } = useAuth();
  if (user?.role === "staff" || user?.role === "admin") return <StaffDashboard />;
  return <StudentDashboard />;
}

function AttendancePage() {
  const { user } = useAuth();
  if (user?.role === "staff" || user?.role === "admin") return <StaffAttendance />;
  return <StudentAttendance />;
}

function MarksPage() {
  const { user } = useAuth();
  if (user?.role === "staff" || user?.role === "admin") return <StaffMarks />;
  return <StudentMarks />;
}

function AnalyticsPage() {
  const { user } = useAuth();
  if (user?.role === "staff" || user?.role === "admin") return <StaffReports />;
  return <StudentAnalytics />;
}

function AssignmentsPage() {
  const { user } = useAuth();
  if (user?.role === "staff" || user?.role === "admin") return <StaffAssignments />;
  return <StudentAssignments />;
}

function AnnouncementsPage() {
  const { user } = useAuth();
  if (user?.role !== "staff" && user?.role !== "admin") return <Navigate to="/" replace />;
  return <StaffAnnouncements />;
}

function LeavePage() {
  const { user } = useAuth();
  if (user?.role !== "staff" && user?.role !== "admin") return <Navigate to="/" replace />;
  return <StaffLeave />;
}

function OfficePage() {
  const { user } = useAuth();
  if (user?.role !== "staff" && user?.role !== "admin") return <Navigate to="/" replace />;
  return <StaffOffice />;
}

function TimetablePage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentTimetable />;
}

function InboxPage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentInbox />;
}

function HallTicketPage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentHallTicket />;
}

function InternshipsPage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentInternships />;
}

function ReportsPage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentReports />;
}

function GoCodePage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentGoCode />;
}

function ProfilePage() {
  const { user } = useAuth();
  if (user?.role !== "student") return <Navigate to="/" replace />;
  return <StudentProfile />;
}

function StaffProfilePage() {
  const { user } = useAuth();
  if (user?.role === "student") return <Navigate to="/" replace />;
  return <StaffProfile />;
}

function NotFound() {
  return <Navigate to="/" replace />;
}

// ── Router ─────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,              Component: DashboardPage },
      { path: "attendance",       Component: AttendancePage },
      { path: "marks",            Component: MarksPage },
      { path: "analytics",        Component: AnalyticsPage },
      { path: "assignments",      Component: AssignmentsPage },
      { path: "announcements",    Component: AnnouncementsPage },
      { path: "leave",            Component: LeavePage },
      { path: "office",           Component: OfficePage },
      { path: "timetable",        Component: TimetablePage },
      { path: "inbox",            Component: InboxPage },
      { path: "hall-ticket",      Component: HallTicketPage },
      { path: "internships",      Component: InternshipsPage },
      { path: "reports",          Component: ReportsPage },
      { path: "gocode",           Component: GoCodePage },
      { path: "profile",          Component: ProfilePage },
      { path: "staff-profile",    Component: StaffProfilePage },
      { path: "chatbot",          Component: ChatbotPage },
      { path: "settings",         Component: Settings },
    ],
  },
  { path: "*", Component: NotFound },
]);
