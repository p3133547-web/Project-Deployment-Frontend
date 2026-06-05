import { CalendarDays, MapPin, User } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const periods = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

type Session = { sub: string; code: string; room: string; faculty: string; type: "theory" | "lab" | "break" | "free" };
type Day = { label: string; sessions: (Session | null)[] };

const timetable: Day[] = [
  {
    label: "Monday",
    sessions: [
      { sub: "Data Structures", code: "CS301", room: "A-301", faculty: "Dr. A. Kumar", type: "theory" },
      { sub: "Machine Learning", code: "CS305", room: "A-201", faculty: "Dr. Priya Nair", type: "theory" },
      { sub: "Web Technologies", code: "CS302", room: "A-205", faculty: "Dr. B. Menon", type: "theory" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      { sub: "Computer Networks", code: "CS303", room: "B-101", faculty: "Dr. C. Rajan", type: "theory" },
      { sub: "Operating Systems", code: "CS304", room: "A-301", faculty: "Dr. D. Pillai", type: "theory" },
      null, null,
    ],
  },
  {
    label: "Tuesday",
    sessions: [
      { sub: "Data Structures Lab", code: "CS301L", room: "Lab 2", faculty: "Dr. A. Kumar", type: "lab" },
      { sub: "Data Structures Lab", code: "CS301L", room: "Lab 2", faculty: "Dr. A. Kumar", type: "lab" },
      { sub: "Machine Learning", code: "CS305", room: "A-201", faculty: "Dr. Priya Nair", type: "theory" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      { sub: "Web Technologies", code: "CS302", room: "A-205", faculty: "Dr. B. Menon", type: "theory" },
      null, null, null,
    ],
  },
  {
    label: "Wednesday",
    sessions: [
      { sub: "Computer Networks", code: "CS303", room: "B-101", faculty: "Dr. C. Rajan", type: "theory" },
      { sub: "Operating Systems Lab", code: "CS304L", room: "Lab 1", faculty: "Dr. D. Pillai", type: "lab" },
      { sub: "Operating Systems Lab", code: "CS304L", room: "Lab 1", faculty: "Dr. D. Pillai", type: "lab" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      { sub: "Data Structures", code: "CS301", room: "A-301", faculty: "Dr. A. Kumar", type: "theory" },
      { sub: "Machine Learning Lab", code: "CS305L", room: "Lab 3", faculty: "Dr. Priya Nair", type: "lab" },
      { sub: "Machine Learning Lab", code: "CS305L", room: "Lab 3", faculty: "Dr. Priya Nair", type: "lab" },
      null,
    ],
  },
  {
    label: "Thursday",
    sessions: [
      { sub: "Web Technologies", code: "CS302", room: "A-205", faculty: "Dr. B. Menon", type: "theory" },
      { sub: "Computer Networks", code: "CS303", room: "B-101", faculty: "Dr. C. Rajan", type: "theory" },
      { sub: "Operating Systems", code: "CS304", room: "A-301", faculty: "Dr. D. Pillai", type: "theory" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      { sub: "Machine Learning", code: "CS305", room: "A-201", faculty: "Dr. Priya Nair", type: "theory" },
      null, null, null,
    ],
  },
  {
    label: "Friday",
    sessions: [
      { sub: "Web Technologies Lab", code: "CS302L", room: "Lab 4", faculty: "Dr. B. Menon", type: "lab" },
      { sub: "Web Technologies Lab", code: "CS302L", room: "Lab 4", faculty: "Dr. B. Menon", type: "lab" },
      { sub: "Data Structures", code: "CS301", room: "A-301", faculty: "Dr. A. Kumar", type: "theory" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      { sub: "Computer Networks", code: "CS303", room: "B-101", faculty: "Dr. C. Rajan", type: "theory" },
      { sub: "Operating Systems", code: "CS304", room: "A-301", faculty: "Dr. D. Pillai", type: "theory" },
      null, null,
    ],
  },
  {
    label: "Saturday",
    sessions: [
      { sub: "Data Structures Lab", code: "CS301L", room: "Lab 2", faculty: "Dr. A. Kumar", type: "lab" },
      { sub: "Data Structures Lab", code: "CS301L", room: "Lab 2", faculty: "Dr. A. Kumar", type: "lab" },
      { sub: "Machine Learning", code: "CS305", room: "A-201", faculty: "Dr. Priya Nair", type: "theory" },
      { sub: "Lunch Break", code: "", room: "", faculty: "", type: "break" },
      null, null, null, null,
    ],
  },
];

const typeStyle: Record<string, string> = {
  theory: "bg-indigo-50 border-indigo-200 text-indigo-700",
  lab:    "bg-orange-50 border-orange-200 text-orange-700",
  break:  "bg-slate-50 border-slate-200 text-slate-400",
  free:   "bg-white border-dashed border-slate-200 text-slate-300",
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date().toLocaleDateString("en-US", { weekday: "long" });


export function StudentTimetable() {
  const { isDark } = useTheme();
  const card    = isDark ? "#1e293b" : "#ffffff";
  const border  = isDark ? "#334155" : "#f1f5f9";
  const textPri = isDark ? "#f1f5f9" : "#1e293b";
  const textSub = isDark ? "#64748b" : "#94a3b8";
  const tableHead = isDark ? "#0f172a" : "#f8fafc";
  const hoverBg   = isDark ? "#0f172a" : "#f8fafc";

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl p-5 flex items-center justify-between"
        style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, color: textPri }}>Class Timetable</h2>
            <p className="text-xs" style={{ color: textSub }}>III CSE Section A · Spring 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs flex-wrap">
          {[{ label: "Theory", cls: "bg-indigo-100 text-indigo-700" }, { label: "Lab", cls: "bg-orange-100 text-orange-700" }, { label: "Break", cls: "bg-slate-100 text-slate-500" }].map(l => (
            <span key={l.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${l.cls}`} style={{ fontWeight: 500 }}>
              <span className="w-2 h-2 rounded-full bg-current" />{l.label}
            </span>
          ))}
        </div>
      </div>

      {/* Timetable grid */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: tableHead, borderBottom: `1px solid ${border}` }}>
                <th className="px-4 py-3 text-left text-xs w-24" style={{ fontWeight: 600, color: textSub }}>Day / Time</th>
                {periods.map(p => (
                  <th key={p} className="px-2 py-3 text-center text-xs whitespace-nowrap" style={{ fontWeight: 600, color: textSub }}>{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((day, di) => (
                <tr key={day.label}
                  style={{
                    borderTop: di > 0 ? `1px solid ${border}` : "none",
                    backgroundColor: day.label === today ? (isDark ? "rgba(79,70,229,0.08)" : "#eef2ff") : "transparent",
                  }}
                  onMouseEnter={e => { if (day.label !== today) e.currentTarget.style.backgroundColor = hoverBg; }}
                  onMouseLeave={e => { if (day.label !== today) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <td className="px-4 py-3">
                    <p className={`text-xs ${day.label === today ? "text-indigo-600" : ""}`}
                      style={{ fontWeight: day.label === today ? 700 : 500, color: day.label === today ? "#4f46e5" : textSub }}>
                      {day.label}
                    </p>
                    {day.label === today && <span className="text-xs text-indigo-500 bg-indigo-100 px-1.5 py-0.5 rounded-md" style={{ fontSize: 10, fontWeight: 600 }}>Today</span>}
                  </td>
                  {day.sessions.map((sess, idx) => (
                    <td key={idx} className="px-1.5 py-2">
                      {sess === null ? (
                        <div className="h-14 rounded-lg flex items-center justify-center"
                          style={{ border: `1px dashed ${border}` }}>
                          <span className="text-xs" style={{ color: textSub }}>—</span>
                        </div>
                      ) : (
                        <div className={`h-14 rounded-lg border px-2 py-1.5 flex flex-col justify-between ${typeStyle[sess.type]}`}>
                          {sess.type === "break" ? (
                            <p className="text-center text-xs" style={{ fontWeight: 500, marginTop: 12 }}>☕ Break</p>
                          ) : (
                            <>
                              <p className="text-xs leading-tight truncate" style={{ fontWeight: 600, fontSize: 11 }}>{sess.sub.replace(" Lab", "")}{sess.type === "lab" ? " 🧪" : ""}</p>
                              <div className="flex items-center gap-1 text-current opacity-70">
                                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                <span style={{ fontSize: 10 }}>{sess.room}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's detail */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: card, border: `1px solid ${border}` }}>
        <p className="text-sm mb-4" style={{ fontWeight: 600, color: textPri }}>Today's Sessions — {today}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(timetable.find(d => d.label === today) ?? timetable[5]).sessions
            .filter((s): s is Session => s !== null && s.type !== "break")
            .map((s, i) => (
              <div key={i} className={`rounded-xl border p-3.5 ${s.type === "lab" ? "bg-orange-50 border-orange-200" : "bg-indigo-50 border-indigo-200"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${s.type === "lab" ? "bg-orange-100 text-orange-700" : "bg-indigo-100 text-indigo-700"}`} style={{ fontWeight: 600 }}>
                    {s.type === "lab" ? "Lab" : "Theory"}
                  </span>
                  <span className="text-xs" style={{ color: textSub }}>{periods[i] ?? "—"}</span>
                </div>
                <p className="text-sm" style={{ fontWeight: 600, color: textPri }}>{s.sub}</p>
                <div className="flex items-center gap-1 mt-1.5" style={{ color: textSub }}>
                  <User className="w-3 h-3" />
                  <span className="text-xs">{s.faculty}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5" style={{ color: textSub }}>
                  <MapPin className="w-3 h-3" />
                  <span className="text-xs">{s.room}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
