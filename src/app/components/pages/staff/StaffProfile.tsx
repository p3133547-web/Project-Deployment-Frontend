import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Briefcase, BookOpen, Building,
  Edit2, Save, CheckCircle2, GraduationCap, Loader2, Award,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { attendanceApi, SubjectOut } from "@/lib/api";

export function StaffProfile() {
  const { user }    = useAuth();
  const { isDark }  = useTheme();

  const [subjects, setSubjects] = useState<SubjectOut[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saved, setSaved]       = useState(false);
  const [phone, setPhone]       = useState("+91 98765 43210");
  const [cabin, setCabin]       = useState("Block A, Room 204");

  useEffect(() => {
    attendanceApi
      .getSubjects({ department: user?.department })
      .then(res => setSubjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Themed tokens ─────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";
  const divider = isDark ? "#1e293b"  : "#f8fafc";

  const fieldStyle = (active = false): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 10,
    border: `1px solid ${active ? "#7c3aed" : border}`,
    borderRadius: 12, padding: "10px 14px",
    backgroundColor: active ? (isDark ? "#1e293b" : "#ffffff") : inputBg,
    transition: "all .2s",
  });

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-3.5 border"
          style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-emerald-700 text-sm" style={{ fontWeight: 500 }}>Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column ── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Profile avatar card */}
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-3xl mx-auto"
                style={{ fontWeight: 700 }}>
                {user?.initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </span>
            </div>

            <h2 style={{ fontWeight: 700, fontSize: 16, color: textPri, marginTop: 16 }}>{user?.name}</h2>
            <p style={{ color: textMed, fontSize: 13, marginTop: 2 }}>{user?.designation}</p>
            <p style={{ color: "#7c3aed", fontSize: 11, marginTop: 2, fontWeight: 500 }}>
              {user?.employeeId ?? "EMP001"}
            </p>

            <div style={{ marginTop: 16, borderTop: `1px solid ${border}`, paddingTop: 16 }} className="space-y-2 text-left">
              {[
                { label: "Department",  value: user?.department ?? "—" },
                { label: "Employee ID", value: user?.employeeId  ?? "EMP001" },
                { label: "Designation", value: user?.designation ?? "—" },
                { label: "Subjects",    value: `${subjects.length} assigned` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: textSub }}>{item.label}</span>
                  <span style={{ color: textMed, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching subjects */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: textPri }}>Teaching Subjects</p>
            </div>
            <div>
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                </div>
              )}
              {!loading && subjects.length === 0 && (
                <p style={{ padding: "12px 16px", fontSize: 12, color: textSub }}>No subjects assigned yet.</p>
              )}
              {subjects.map((s, idx) => (
                <div key={s.id}
                  className="flex items-center gap-3 transition-colors"
                  style={{
                    padding: "10px 16px",
                    borderTop: idx > 0 ? `1px solid ${divider}` : "none",
                    cursor: "default",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 12, fontWeight: 600, color: textPri }} className="truncate">{s.name}</p>
                    <p style={{ fontSize: 11, color: textSub }}>{s.code} · Sem {s.semester} · {s.credits} cr</p>
                  </div>
                  {s.is_lab && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#ea580c", backgroundColor: "#fff7ed", padding: "2px 6px", borderRadius: 6 }}>
                      Lab
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: Faculty Info form ── */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
            <h3 style={{ fontWeight: 600, fontSize: 15, color: textPri }}>Faculty Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 transition-colors text-sm"
                style={{ fontWeight: 500 }}
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-violet-700 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          <div style={{ padding: 20 }} className="space-y-4">
            {/* Read-only fields */}
            {[
              { label: "Full Name",   value: user?.name        ?? "", icon: User       },
              { label: "Email",       value: user?.email       ?? "", icon: Mail       },
              { label: "Department",  value: user?.department  ?? "", icon: Building   },
              { label: "Designation", value: user?.designation ?? "", icon: Briefcase  },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                <div style={fieldStyle()}>
                  <field.icon style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                  <input
                    type="text" value={field.value} readOnly
                    className="outline-none w-full bg-transparent text-sm"
                    style={{ color: textMed }}
                  />
                </div>
              </div>
            ))}

            {/* Editable: phone */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                Phone Number
              </label>
              <div style={fieldStyle(editing)}>
                <Phone style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                <input
                  type="text" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  readOnly={!editing}
                  className="outline-none w-full bg-transparent text-sm"
                  style={{ color: textMed }}
                />
              </div>
            </div>

            {/* Editable: office/cabin */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                Office / Cabin
              </label>
              <div style={fieldStyle(editing)}>
                <GraduationCap style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                <input
                  type="text" value={cabin}
                  onChange={e => setCabin(e.target.value)}
                  readOnly={!editing}
                  className="outline-none w-full bg-transparent text-sm"
                  style={{ color: textMed }}
                />
              </div>
            </div>

            {editing && (
              <div className="rounded-xl px-4 py-3"
                style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: `1px solid ${isDark ? "rgba(217,119,6,0.3)" : "#fde68a"}` }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: isDark ? "#fcd34d" : "#92400e" }}>
                  ⚠ Name, email, department and designation can only be updated by the Academic Office.
                </p>
              </div>
            )}

            {/* Academic overview bar */}
            <div className="rounded-xl p-4 mt-2"
              style={{ backgroundColor: isDark ? "rgba(124,58,237,0.12)" : "#f5f3ff", border: `1px solid ${isDark ? "rgba(124,58,237,0.3)" : "#ddd6fe"}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-violet-500" />
                <p style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#c4b5fd" : "#5b21b6" }}>Academic Summary</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Subjects", value: subjects.length.toString() },
                  { label: "Dept",     value: user?.department?.slice(0, 3)?.toUpperCase() ?? "—" },
                  { label: "Role",     value: user?.role === "staff" ? "Faculty" : "Admin" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p style={{ fontWeight: 700, fontSize: 20, color: isDark ? "#c4b5fd" : "#7c3aed" }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: textSub, marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
