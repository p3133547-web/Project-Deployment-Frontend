import { useState } from "react";
import { useNavigate } from "react-router";
import { GraduationCap, Eye, EyeOff, ArrowRight, CheckCircle2, BookOpen, Users, Sparkles } from "lucide-react";
import { useAuth, Role } from "../../context/AuthContext";

const CAMPUS_IMG = "https://images.unsplash.com/photo-1770146605604-df69d911c7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMGNvbGxlZ2UlMjBjYW1wdXMlMjBtb2Rlcm4lMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzc1ODg2MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080";

const roles: { key: Role; label: string; sub: string; icon: React.ReactNode; accent: string; border: string; bg: string }[] = [
  { key: "student", label: "Student", sub: "View marks, attendance & more", icon: <BookOpen className="w-5 h-5" />, accent: "text-blue-600", border: "border-blue-500", bg: "bg-blue-50" },
  { key: "staff",   label: "Staff",   sub: "Manage classes & reports",       icon: <Users className="w-5 h-5" />,    accent: "text-violet-600", border: "border-violet-500", bg: "bg-violet-50" },
];

const demoMap: Record<Role, { email: string; pass: string }> = {
  student: { email: "rahul.sharma@student.intellicampus.edu", pass: "Student@1234" },
  staff:   { email: "priya.ramesh@intellicampus.edu",          pass: "Staff@1234"   },
  admin:   { email: "admin@intellicampus.edu",                 pass: "Admin@1234"   },
};

export function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [role, setRole]     = useState<Role>("student");
  const [email, setEmail]   = useState(demoMap["student"].email);
  const [pass, setPass]     = useState(demoMap["student"].pass);
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const switchRole = (r: Role) => {
    setRole(r);
    setEmail(demoMap[r].email);
    setPass(demoMap[r].pass);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required."); return; }
    if (!pass.trim())  { setError("Password is required."); return; }
    setError("");
    setLoading(true);
    try {
      const ok = await login(email, pass, role);
      if (ok) navigate("/");
      else setError("Invalid credentials. Please check your email and password.");
    } catch {
      setError("Unable to connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter bg-slate-50">
      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col overflow-hidden">
        <img src={CAMPUS_IMG} alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/93 via-blue-900/88 to-blue-800/80" />
        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontWeight: 700, fontSize: 20 }}>IntelliCampus</p>
              <p className="text-blue-200 text-xs">Academic Management System</p>
            </div>
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full mb-6 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-white text-xs" style={{ fontWeight: 500 }}>AI-Powered Academic Platform</span>
            </div>
            <h1 className="text-white mb-5" style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.12 }}>
              Manage. Learn.<br />Excel. Together.
            </h1>
            <p className="text-blue-100 mb-10" style={{ fontSize: 15, lineHeight: 1.8 }}>
              A centralized platform for students and faculty — powered by Graph RAG AI insights, real-time analytics, and seamless academic workflows.
            </p>
            <div className="space-y-3.5">
              {[
                "Real-time attendance & marks tracking",
                "Graph RAG AI chatbot for academic queries",
                "Advanced analytics & performance insights",
                "Automated assignment & leave management",
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-300 flex-shrink-0" style={{ width: 18, height: 18 }} />
                  <p className="text-blue-100 text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {[{ v: "4,200+", l: "Students" }, { v: "180+", l: "Faculty" }, { v: "98%", l: "Satisfaction" }].map(s => (
              <div key={s.l}>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 700 }}>{s.v}</p>
                <p className="text-blue-200 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-800" style={{ fontWeight: 700, fontSize: 17 }}>IntelliCampus</p>
              <p className="text-slate-400 text-xs">Academic Management System</p>
            </div>
          </div>

          <h2 className="text-slate-800 mb-1" style={{ fontSize: 26, fontWeight: 700 }}>Welcome back</h2>
          <p className="text-slate-500 text-sm mb-7">Sign in to access your portal</p>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-slate-600 text-xs mb-3 uppercase tracking-wider" style={{ fontWeight: 600 }}>Select your role</p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button key={r.key} type="button" onClick={() => switchRole(r.key)}
                  className={`relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border-2 transition-all duration-200 ${
                    role === r.key ? `${r.border} ${r.bg} ${r.accent}` : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}>
                  {role === r.key && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                  )}
                  {r.icon}
                  <span className="text-xs" style={{ fontWeight: role === r.key ? 600 : 500 }}>{r.label}</span>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-xs mt-2 text-center">{roles.find(r => r.key === role)?.sub}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-700 text-sm block mb-1.5" style={{ fontWeight: 500 }}>Email / Roll No.</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@college.edu"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>Password</label>
                <button type="button" className="text-indigo-600 text-xs hover:underline" style={{ fontWeight: 500 }}>Forgot password?</button>
              </div>
              <div className="relative">
                <input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-700 text-sm placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0" style={{ fontWeight: 700 }}>!</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm text-white transition-all ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.99]"}`}
              style={{ fontWeight: 600 }}>
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Signing in...</>
              ) : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-indigo-700 text-xs" style={{ fontWeight: 600 }}>🎓 Demo Credentials</p>
            <p className="text-indigo-600 text-xs mt-1 leading-relaxed">
              Switch roles above — credentials auto-fill from the seeded database.<br />
              <span className="font-medium">Student:</span> rahul.sharma@student.intellicampus.edu / Student@1234<br />
              <span className="font-medium">Staff:</span> priya.ramesh@intellicampus.edu / Staff@1234
            </p>
          </div>

          <p className="text-slate-400 text-xs text-center mt-6">© 2026 IntelliCampus · Engineering College</p>
        </div>
      </div>
    </div>
  );
}
