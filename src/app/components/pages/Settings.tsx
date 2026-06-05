import { useState } from "react";
import {
  User, Bell, Shield, Palette, Globe, Download, Trash2,
  ChevronRight, Check, Moon, Sun, Monitor, Mail, MessageSquare,
  Smartphone, Eye, EyeOff, Camera, Edit2, LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router";

type Tab = "profile" | "appearance" | "notifications" | "privacy" | "account";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "appearance",   label: "Appearance",    icon: Palette },
  { id: "notifications",label: "Notifications", icon: Bell },
  { id: "privacy",      label: "Privacy",       icon: Shield },
  { id: "account",      label: "Account",       icon: Globe },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

function SectionCard({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{title}</h3>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-4 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab]   = useState<Tab>("profile");
  const { user, logout }            = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate                    = useNavigate();

  // Notification toggles
  const [notifs, setNotifs] = useState({
    emailAssignments: true,
    emailAttendance:  false,
    emailAnnouncements: true,
    pushAll:          true,
    pushAttendance:   true,
    pushAssignments:  true,
    smsAlerts:        false,
  });

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }));

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    showProfile:      true,
    showAttendance:   false,
    showMarks:        false,
    activityStatus:   true,
  });

  const togglePrivacy = (key: keyof typeof privacy) =>
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  // Profile edit state
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name ?? "");

  const handleLogout = () => { logout(); navigate("/login"); };

  // Theme options
  type ThemeOpt = "light" | "dark" | "system";
  const [selectedTheme, setSelectedTheme] = useState<ThemeOpt>(theme);
  const themeOptions: { id: ThemeOpt; label: string; icon: React.ElementType }[] = [
    { id: "light",  label: "Light",  icon: Sun },
    { id: "dark",   label: "Dark",   icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const handleThemeSelect = (opt: ThemeOpt) => {
    setSelectedTheme(opt);
    if (opt === "system") {
      const pref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if ((pref === "dark") !== isDark) toggleTheme();
    } else if ((opt === "dark") !== isDark) {
      toggleTheme();
    }
  };

  // Accent colour
  const [accent, setAccent] = useState("indigo");
  const accents = [
    { id: "indigo",  label: "Indigo",  cls: "bg-indigo-600" },
    { id: "blue",    label: "Blue",    cls: "bg-blue-600" },
    { id: "violet",  label: "Violet",  cls: "bg-violet-600" },
    { id: "emerald", label: "Emerald", cls: "bg-emerald-600" },
    { id: "rose",    label: "Rose",    cls: "bg-rose-600" },
    { id: "amber",   label: "Amber",   cls: "bg-amber-500" },
  ];

  return (
    <div className="min-h-full" style={{ backgroundColor: isDark ? "#0f172a" : "#f8fafc" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account, appearance, and notification preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar tabs ── */}
          <aside className="lg:w-52 flex-shrink-0">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`settings-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left
                      border-b border-slate-100 dark:border-slate-700 last:border-0
                      ${active
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-medium"
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-500" />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Content panel ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ─── PROFILE ─── */}
            {activeTab === "profile" && (
              <>
                <SectionCard title="Personal Information" description="Update your display name and profile details.">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 pb-2">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl ${user?.role === "staff" ? "bg-violet-600" : "bg-blue-600"} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                        {user?.initials}
                      </div>
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                        <Camera className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${user?.role === "staff" ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"}`}>
                        {user?.designation}
                      </span>
                    </div>
                  </div>

                  {/* Name edit */}
                  <SettingRow label="Display Name" description="This name appears across the platform.">
                    {editingName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          className="text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 w-36 outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button onClick={() => setEditingName(false)} className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingName(true)}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                    )}
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Academic Information" description="Read-only information from your institutional record.">
                  {[
                    { label: "Institution", value: "Government College of Engineering" },
                    { label: "Department", value: user?.department ?? "—" },
                    ...(user?.role === "student" ? [
                      { label: "Roll Number", value: user?.rollNo ?? "—" },
                      { label: "Year", value: user?.year ?? "—" },
                      { label: "Section", value: user?.section ?? "—" },
                    ] : [
                      { label: "Employee ID", value: user?.id ?? "—" },
                      { label: "Designation", value: user?.designation ?? "—" },
                    ]),
                  ].map(item => (
                    <SettingRow key={item.label} label={item.label}>
                      <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">{item.value}</span>
                    </SettingRow>
                  ))}
                </SectionCard>
              </>
            )}

            {/* ─── APPEARANCE ─── */}
            {activeTab === "appearance" && (
              <>
                <SectionCard title="Color Theme" description="Choose between light, dark, or follow your system preference.">
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map(opt => {
                      const selected = selectedTheme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          id={`theme-option-${opt.id}`}
                          onClick={() => handleThemeSelect(opt.id)}
                          className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            selected
                              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
                              : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-700"
                          }`}
                        >
                          <opt.icon className={`w-5 h-5 ${selected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                          <span className={`text-xs font-medium ${selected ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400"}`}>{opt.label}</span>
                          {selected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>

                <SectionCard title="Accent Color" description="Personalize the highlight color used across the app.">
                  <div className="flex items-center gap-3 flex-wrap">
                    {accents.map(a => (
                      <button
                        key={a.id}
                        id={`accent-${a.id}`}
                        onClick={() => setAccent(a.id)}
                        title={a.label}
                        className={`w-8 h-8 rounded-full ${a.cls} flex items-center justify-center transition-transform hover:scale-110 ${accent === a.id ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}`}
                      >
                        {accent === a.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Selected: {accents.find(a => a.id === accent)?.label}</p>
                </SectionCard>

                <SectionCard title="Display" description="Control content density and layout preferences.">
                  <SettingRow label="Compact mode" description="Reduce spacing for more content on screen.">
                    <Toggle checked={false} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="Show page subtitles" description="Display descriptive subtitles in the topbar.">
                    <Toggle checked={true} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="Animate transitions" description="Smooth page and element transitions.">
                    <Toggle checked={true} onChange={() => {}} />
                  </SettingRow>
                </SectionCard>
              </>
            )}

            {/* ─── NOTIFICATIONS ─── */}
            {activeTab === "notifications" && (
              <>
                <SectionCard title="Email Notifications" description="Choose which events trigger email alerts.">
                  <SettingRow label="Assignment reminders" description="Get notified 24 hrs before submission deadlines." children={<Toggle checked={notifs.emailAssignments} onChange={() => toggleNotif("emailAssignments")} />} />
                  <SettingRow label="Attendance alerts" description="Alert when attendance falls below 75%." children={<Toggle checked={notifs.emailAttendance} onChange={() => toggleNotif("emailAttendance")} />} />
                  <SettingRow label="Announcements" description="New circulars and college notices via email." children={<Toggle checked={notifs.emailAnnouncements} onChange={() => toggleNotif("emailAnnouncements")} />} />
                </SectionCard>

                <SectionCard title="Push Notifications" description="In-app and browser push notification settings.">
                  <SettingRow label="All notifications" description="Master switch for all push alerts." children={<Toggle checked={notifs.pushAll} onChange={() => toggleNotif("pushAll")} />} />
                  <SettingRow label="Attendance updates" description="Pushed when teacher marks attendance." children={<Toggle checked={notifs.pushAttendance} onChange={() => toggleNotif("pushAttendance")} />} />
                  <SettingRow label="Assignment alerts" description="New assignments and submission confirmations." children={<Toggle checked={notifs.pushAssignments} onChange={() => toggleNotif("pushAssignments")} />} />
                </SectionCard>

                <SectionCard title="SMS / WhatsApp" description="Critical alerts via your registered mobile number.">
                  <SettingRow label="SMS alerts" description="Receive critical alerts via SMS (charges may apply)." children={<Toggle checked={notifs.smsAlerts} onChange={() => toggleNotif("smsAlerts")} />} />
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <Smartphone className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">Registered mobile: +91 98XXX XXXXX. Update via your institution portal.</p>
                  </div>
                </SectionCard>

                <SectionCard title="Notification Channels" description="Select how you prefer to receive each type of alert.">
                  {[
                    { label: "Attendance",    Icon: null },
                    { label: "Marks",         Icon: null },
                    { label: "Assignments",   Icon: null },
                    { label: "Announcements", Icon: null },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium w-32">{row.label}</p>
                      <div className="flex items-center gap-3">
                        {[{ icon: Bell, label: "Push" }, { icon: Mail, label: "Email" }, { icon: MessageSquare, label: "SMS" }].map(ch => (
                          <label key={ch.label} className="flex items-center gap-1.5 cursor-pointer group">
                            <input type="checkbox" defaultChecked={ch.label !== "SMS"} className="rounded accent-indigo-600 w-3.5 h-3.5" />
                            <span className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 flex items-center gap-1">
                              <ch.icon className="w-3 h-3" />{ch.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </SectionCard>
              </>
            )}

            {/* ─── PRIVACY ─── */}
            {activeTab === "privacy" && (
              <>
                <SectionCard title="Profile Visibility" description="Control who can see your information.">
                  <SettingRow label="Show profile to others" description="Other students and staff can view your public profile." children={<Toggle checked={privacy.showProfile} onChange={() => togglePrivacy("showProfile")} />} />
                  <SettingRow label="Show attendance record" description="Allow faculty to view your full attendance breakdown." children={<Toggle checked={privacy.showAttendance} onChange={() => togglePrivacy("showAttendance")} />} />
                  <SettingRow label="Show marks to classmates" description="Peers can see your marks on leaderboards." children={<Toggle checked={privacy.showMarks} onChange={() => togglePrivacy("showMarks")} />} />
                  <SettingRow label="Online activity status" description="Show 'online' indicator to others." children={<Toggle checked={privacy.activityStatus} onChange={() => togglePrivacy("activityStatus")} />} />
                </SectionCard>

                <SectionCard title="Data & Analytics" description="Choose what academic data IntelliCampus collects.">
                  <SettingRow label="Usage analytics" description="Help improve the platform by sharing anonymous usage data.">
                    <Toggle checked={true} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="Personalized recommendations" description="AI-powered study suggestions based on your performance.">
                    <Toggle checked={true} onChange={() => {}} />
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Password & Security" description="Manage your login credentials and security settings.">
                  <SettingRow label="Two-factor authentication" description="Add an extra layer of security via TOTP or SMS.">
                    <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Enable 2FA
                    </button>
                  </SettingRow>
                  <SettingRow label="Change password" description="Last changed: Never (using institution SSO).">
                    <button className="text-xs text-slate-600 dark:text-slate-300 font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Change
                    </button>
                  </SettingRow>
                  <SettingRow label="Active sessions" description="Manage devices where you are currently signed in.">
                    <button className="text-xs text-slate-600 dark:text-slate-300 font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1">
                      <Monitor className="w-3 h-3" /> View
                    </button>
                  </SettingRow>
                </SectionCard>
              </>
            )}

            {/* ─── ACCOUNT ─── */}
            {activeTab === "account" && (
              <>
                <SectionCard title="Language & Region" description="Set your preferred language and timezone.">
                  <SettingRow label="Language">
                    <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>English (India)</option>
                      <option>Tamil</option>
                      <option>Hindi</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Timezone">
                    <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Asia/Kolkata (IST +5:30)</option>
                      <option>UTC</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Date format">
                    <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Data Export" description="Download a copy of your academic data.">
                  <SettingRow label="Export academic records" description="Attendance, marks, and assignment history as CSV.">
                    <button className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Download className="w-3 h-3" /> Export CSV
                    </button>
                  </SettingRow>
                  <SettingRow label="Export full profile" description="Complete data package as JSON (DPDPA compliant).">
                    <button className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Download className="w-3 h-3" /> Export JSON
                    </button>
                  </SettingRow>
                </SectionCard>

                <SectionCard title="Sign Out & Danger Zone" description="Sign out or permanently deactivate your account.">
                  <SettingRow label="Sign out" description="Sign out from all sessions on this device.">
                    <button
                      id="settings-logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                    >
                      <LogOut className="w-3 h-3" /> Sign out
                    </button>
                  </SettingRow>
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                    <SettingRow label="Delete account" description="Permanently delete your account and all data. This action is irreversible.">
                      <button className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-300 dark:border-red-700">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </SettingRow>
                  </div>
                </SectionCard>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
