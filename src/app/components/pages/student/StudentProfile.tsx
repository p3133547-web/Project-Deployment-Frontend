import { useState } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Edit2, Save, Upload, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

export function StudentProfile() {
  const { user }   = useAuth();
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [phone, setPhone]     = useState("+91 98765 43210");
  const [address, setAddress] = useState("Chennai, Tamil Nadu, India");

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const textMed = isDark ? "#94a3b8" : "#475569";
  const inputBg = isDark ? "#0f172a"  : "#f8fafc";

  const docList = [
    { name: "Aadhar Card",            status: "Verified" },
    { name: "10th Mark Sheet",        status: "Verified" },
    { name: "12th Mark Sheet",        status: "Verified" },
    { name: "Transfer Certificate",   status: "Pending"  },
    { name: "Community Certificate",  status: "Verified" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-4xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
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
          {/* Avatar card */}
          <div className="rounded-2xl p-6 text-center"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl mx-auto"
                style={{ fontWeight: 700 }}>
                {user?.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
                <Upload className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 16, color: textPri, marginTop: 16 }}>{user?.name}</h2>
            <p style={{ color: textMed, fontSize: 13, marginTop: 2 }}>{user?.designation}</p>
            <p style={{ color: "#4f46e5", fontSize: 11, marginTop: 2, fontWeight: 500 }}>{user?.rollNo}</p>

            <div style={{ marginTop: 16, borderTop: `1px solid ${border}`, paddingTop: 16 }} className="space-y-2 text-left">
              {[
                { label: "Department", value: user?.department ?? "—" },
                { label: "Year",       value: user?.year ? `Year ${user.year}` : "—" },
                { label: "Section",    value: user?.section ?? "—" },
                { label: "Semester",   value: user?.year ? `${(user.year * 2) - 1} / ${user.year * 2}` : "—" },
                { label: "Batch",      value: "2021–2025" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: textSub }}>{item.label}</span>
                  <span style={{ color: textMed, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: card, border: `1px solid ${border}` }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}` }}>
              <p style={{ fontWeight: 600, fontSize: 13, color: textPri }}>Documents</p>
            </div>
            <div>
              {docList.map((doc, idx) => (
                <div key={doc.name}
                  className="flex items-center justify-between transition-colors"
                  style={{ padding: "10px 16px", borderTop: idx > 0 ? `1px solid ${border}` : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "#0f172a" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                  <p style={{ color: textMed, fontSize: 12, fontWeight: 500 }}>{doc.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${doc.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    style={{ fontWeight: 500 }}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: Personal details ── */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ backgroundColor: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between"
            style={{ padding: "16px 20px", borderBottom: `1px solid ${border}` }}>
            <h3 style={{ fontWeight: 600, fontSize: 15, color: textPri }}>Personal Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
                style={{ fontWeight: 500 }}>
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <button onClick={handleSave}
                className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors"
                style={{ fontWeight: 500 }}>
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          <div style={{ padding: 20 }} className="space-y-4">
            {[
              { label: "Full Name",      value: user?.name       ?? "", icon: User         },
              { label: "Email Address",  value: user?.email      ?? "", icon: Mail         },
              { label: "Roll Number",    value: user?.rollNo     ?? "21CS001", icon: GraduationCap },
              { label: "Department",     value: user?.department ?? "", icon: BookOpen      },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                <div className="flex items-center gap-3 rounded-xl"
                  style={{ padding: "10px 14px", backgroundColor: inputBg, border: `1px solid ${border}` }}>
                  <field.icon style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                  <input type="text" value={field.value} readOnly
                    className="bg-transparent outline-none w-full text-sm"
                    style={{ color: textMed }} />
                </div>
              </div>
            ))}

            {/* Editable: phone */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                Phone Number
              </label>
              <div className="flex items-center gap-3 rounded-xl transition-all"
                style={{
                  padding: "10px 14px",
                  backgroundColor: editing ? (isDark ? "#1e293b" : "#ffffff") : inputBg,
                  border: `1px solid ${editing ? "#4f46e5" : border}`,
                }}>
                <Phone style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                <input type="text" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  readOnly={!editing}
                  className="bg-transparent outline-none w-full text-sm"
                  style={{ color: textMed }} />
              </div>
            </div>

            {/* Editable: address */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 500, color: textSub, display: "block", marginBottom: 6 }}>
                Address
              </label>
              <div className="flex items-center gap-3 rounded-xl transition-all"
                style={{
                  padding: "10px 14px",
                  backgroundColor: editing ? (isDark ? "#1e293b" : "#ffffff") : inputBg,
                  border: `1px solid ${editing ? "#4f46e5" : border}`,
                }}>
                <MapPin style={{ width: 16, height: 16, color: textSub, flexShrink: 0 }} />
                <input type="text" value={address}
                  onChange={e => setAddress(e.target.value)}
                  readOnly={!editing}
                  className="bg-transparent outline-none w-full text-sm"
                  style={{ color: textMed }} />
              </div>
            </div>

            {editing && (
              <div className="rounded-xl px-4 py-3"
                style={{ backgroundColor: isDark ? "rgba(217,119,6,0.1)" : "#fffbeb", border: `1px solid ${isDark ? "rgba(217,119,6,0.3)" : "#fde68a"}` }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: isDark ? "#fcd34d" : "#92400e" }}>
                  ⚠ Name, email, roll number, and department can only be updated by your academic office.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
