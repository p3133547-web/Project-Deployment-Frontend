import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, AlertTriangle, Mic, MicOff, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { chatbotApi } from "../../lib/api";

interface Msg {
  id: number;
  role: "user" | "ai";
  text: string;
  bad?: boolean;
  offline?: boolean;
  ts: Date;
  sources?: string[];
  graphFacts?: string[];
}

// ── Offline fallback (rule-based) ─────────────────────────────────────────────
const GREETINGS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "good night", "greetings", "howdy"];
const ACADEMIC_KW = [
  "attendance", "marks", "result", "grade", "cgpa", "sgpa", "gpa",
  "assignment", "deadline", "exam", "test", "quiz", "hall ticket",
  "timetable", "schedule", "holiday", "class", "course", "subject",
  "leave", "od", "internship", "announcement", "notice", "circular",
  "fee", "semester", "report", "retest", "internal", "practical",
  "academic", "college", "department", "faculty", "professor",
  "syllabus", "campus", "submission", "arrear", "backlog",
];

function isAcademic(msg: string) {
  const l = msg.toLowerCase();
  if (GREETINGS.some(g => l.includes(g))) return true;
  return ACADEMIC_KW.some(k => l.includes(k));
}

function localRespond(msg: string, role: string | undefined): string {
  const l = msg.toLowerCase();
  if (GREETINGS.some(g => l === g || l.startsWith(g)))
    return `Hello! 👋 I'm your Academic AI Assistant. I'm currently in offline mode, but I can still help with basic queries. Ask me about attendance, marks, timetable, or exams.`;
  if (l.includes("attendance"))
    return `📊 **Attendance Rule:** Minimum 75% required per subject to be eligible for end-semester exams.\n\nTo see your live attendance, visit the Attendance page. If the AI backend is offline, data is still available directly in the portal.`;
  if (l.includes("marks") || l.includes("internal"))
    return `📝 **Marks & Assessments:** Two Cycle Tests (CT1, CT2) are conducted per semester. Results are available in the Marks section of your portal.`;
  if (l.includes("holiday"))
    return `📅 For the current holiday calendar, check the Announcements section in your portal. The academic calendar is updated each semester.`;
  if (l.includes("deadline") || l.includes("assignment"))
    return `📋 **Assignments:** Check the Assignments section for live deadlines. Submit before the due date to avoid penalty marks.`;
  if (l.includes("timetable") || l.includes("schedule"))
    return `🗓 Your timetable is available in the Timetable section. For today's classes, check your department notice board or the portal.`;
  if (l.includes("cgpa") || l.includes("sgpa") || l.includes("gpa") || l.includes("grade"))
    return `🎓 **CGPA Calculation:** CGPA is the weighted average of grade points across all semesters. Your current CGPA is visible in the Marks section.`;
  if (l.includes("exam") || l.includes("hall ticket"))
    return `📋 **Hall Ticket:** Available to download from the Hall Ticket section once exam registration is complete and attendance is ≥ 75% in all subjects.`;
  if (l.includes("leave") || l.includes("od"))
    return `📝 **Leave Application:** Apply for leave in the Attendance → Leave section. OD requires prior approval from faculty. Sick leave needs a medical certificate.`;
  if (l.includes("announcement") || l.includes("notice"))
    return `📢 Check the Announcements section for the latest notices, circulars, and updates from the college.`;
  if (l.includes("fee"))
    return `💰 **Fee Details:** Contact the accounts section or check the college administration portal for fee status and payment details.`;
  if (l.includes("internship"))
    return `💼 View and apply for internship opportunities in the Internships section. Track your application status there.`;
  return `I can help with:\n• Attendance & Eligibility\n• Marks & CGPA\n• Timetable & Schedule\n• Assignments & Deadlines\n• Leave & OD requests\n• Announcements\n• Exam & Hall Ticket\n• Internships\n\nWhat would you like to know?`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function FloatingChatbot() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: 0, role: "ai", ts: new Date(),
    text: `Hi ${user?.name?.split(" ")[0] ?? "there"}! 👋 I'm your Academic AI Assistant powered by IntelliCampus RAG. Ask me about attendance, marks, timetable, exams, or anything academic!`,
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  // ── Voice input ────────────────────────────────────────────────────────────
  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in your browser. Try Chrome or Edge.");
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const recognition = new SR();
    recognition.lang            = "en-US";
    recognition.continuous      = false;
    recognition.interimResults  = false;
    recognition.onstart  = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onend   = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const send = async (text?: string) => {
    const t = text ?? input.trim();
    if (!t || typing) return;
    setInput("");

    const userMsg: Msg = { id: Date.now(), role: "user", text: t, ts: new Date() };
    setMsgs(p => [...p, userMsg]);
    setTyping(true);

    try {
      const res = await chatbotApi.query(t, sessionId);
      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: "ai",
        ts: new Date(),
        text: res.data.message.content,
        sources: res.data.sources?.map((s: any) => s.document_title) || [],
      };
      setMsgs(p => [...p, aiMsg]);
      setSessionId(res.data.conversation_id);
      setBackendOnline(true);
    } catch (e) {
      console.error(e);
      setBackendOnline(false);
      // Fallback
      const bad = !isAcademic(t);
      const aiMsg: Msg = {
        id: Date.now() + 1,
        role: "ai",
        ts: new Date(),
        bad,
        offline: true,
        text: bad
          ? "⚠️ This query is outside academic scope. Please ask an academic-related question."
          : localRespond(t, user?.role),
      };
      setMsgs(p => [...p, aiMsg]);
    } finally {
      setTyping(false);
    }
  };

  const chips = [
    "My attendance?", "Today's timetable", "Upcoming holidays",
    "Assignment deadlines", "My CGPA?",
    ...(user?.role === "staff" ? ["Pending leaves?", "Mark attendance"] : []),
  ];

  // ── Themed tokens ──────────────────────────────────────────────────────────
  const panelBg  = isDark ? "#1e293b" : "#ffffff";
  const panelBd  = isDark ? "#334155" : "#e2e8f0";
  const msgArea  = isDark ? "#0f172a" : "#f8fafc";
  const inputBg  = isDark ? "#0f172a" : "#f8fafc";
  const inputBd  = isDark ? "#334155" : "#e2e8f0";
  const userText = isDark ? "#c7d2fe" : "#ffffff";

  const formatTime = (ts: Date) => {
    const diff = Math.floor((Date.now() - ts.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          id="chatbot-toggle"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[590px] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: panelBg, border: `1px solid ${panelBd}`, fontFamily: "Inter, sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-indigo-600">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot style={{ width: 18, height: 18 }} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm" style={{ fontWeight: 600 }}>Academic AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <p className="text-indigo-200 text-xs">
                  {backendOnline === false ? "Offline mode · Basic answers" : "Online · RAG-powered"}
                </p>
              </div>
            </div>
            {/* Connectivity badge */}
            {backendOnline === false && (
              <div className="flex items-center gap-1 text-amber-300 text-xs" title="Backend offline — using fallback responses">
                <WifiOff className="w-3.5 h-3.5" />
              </div>
            )}
            {backendOnline === true && (
              <div className="flex items-center gap-1 text-emerald-300 text-xs" title="Connected to IntelliCampus AI backend">
                <Wifi className="w-3.5 h-3.5" />
              </div>
            )}
            <button
              id="chatbot-close"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/15 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Offline banner */}
          {backendOnline === false && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100">
              <WifiOff className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-600 text-xs">
                AI backend offline — using built-in responses.{" "}
                <span className="font-medium">Start the FastAPI server to enable RAG.</span>
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 320, backgroundColor: msgArea }}>
            {msgs.map(m => (
              <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "ai" && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    m.bad ? "bg-amber-100" : m.offline ? "bg-slate-200" : "bg-indigo-600"
                  }`}>
                    {m.bad
                      ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      : m.offline
                        ? <Bot className="w-3.5 h-3.5 text-slate-500" />
                        : <Bot className="w-3.5 h-3.5 text-white" />
                    }
                  </div>
                )}
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm"
                    : m.bad
                      ? "rounded-tl-sm"
                      : m.offline
                        ? "rounded-tl-sm"
                        : "rounded-tl-sm"
                }`}
                style={{
                  backgroundColor:
                    m.role === "user"    ? "#4f46e5" :
                    m.bad               ? (isDark ? "#3d2a08" : "#fffbeb") :
                    m.offline           ? (isDark ? "#1e293b" : "#f1f5f9") :
                                         (isDark ? "#0f172a" : "#ffffff"),
                  border: `1px solid ${
                    m.role === "user"  ? "transparent" :
                    m.bad             ? (isDark ? "#78350f" : "#fde68a") :
                    m.offline         ? (isDark ? "#334155" : "#e2e8f0") :
                                        (isDark ? "#1e293b" : "#e2e8f0")
                  }`,
                  color: m.role === "user" ? userText : (isDark ? "#cbd5e1" : "#334155"),
                }}>
                  {m.text.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line.split(/\*\*(.*?)\*\*/g).map((p, j) =>
                        j % 2 === 1 ? <strong key={j}>{p}</strong> : p
                      )}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                  
                  {/* Graph Facts Rendering */}
                  {m.graphFacts && m.graphFacts.length > 0 && (
                     <div className="mt-2 pt-2 border-t border-slate-200/60">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Knowledge Graph</p>
                        <ul className="list-disc pl-3 text-[11px] text-slate-600 space-y-0.5">
                           {m.graphFacts.map((fact, idx) => (
                              <li key={idx}>{fact}</li>
                           ))}
                        </ul>
                     </div>
                  )}

                  {/* Sources Rendering */}
                  {m.sources && m.sources.length > 0 && (
                     <div className="mt-2 flex flex-wrap gap-1">
                        {m.sources.map((src, idx) => (
                           <span key={idx} className="bg-indigo-50 text-indigo-500 border border-indigo-100 text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center">
                              📄 {src.replace('.md', '')}
                           </span>
                        ))}
                     </div>
                  )}

                  {m.offline && !m.bad && (
                    <span className="block mt-1 text-slate-400" style={{ fontSize: 10 }}>
                      ⚡ Offline response
                    </span>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          {msgs.length <= 2 && (
            <div className="px-3 py-2 border-t" style={{ backgroundColor: panelBg, borderColor: panelBd }}>
              <div className="flex flex-wrap gap-1.5">
                {chips.map(c => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3" style={{ backgroundColor: panelBg, borderTop: `1px solid ${panelBd}` }}>
            <div className="flex gap-2 items-center rounded-xl border px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
              style={{ backgroundColor: inputBg, borderColor: isListening ? "#ef4444" : inputBd }}>
              <input
                id="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") send(); }}
                placeholder={isListening ? "Listening… speak now" : "Ask an academic question…"}
                className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                style={{ color: isDark ? "#cbd5e1" : "#334155" }}
              />
              <button
                onClick={toggleVoice}
                title={isListening ? "Stop listening" : "Voice input"}
                className={`relative transition-colors ${
                  isListening ? "text-red-500" : (isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600")
                }`}
              >
                {isListening
                  ? <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    </>
                  : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                id="chatbot-send"
                onClick={() => send()}
                disabled={!input.trim() || typing}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  input.trim() && !typing
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            <p className="text-center text-slate-300 text-xs mt-1.5" style={{ fontSize: 10, color: isDark ? "#475569" : "#cbd5e1" }}>
              IntelliCampus AI · Academic queries only
            </p>
          </div>
        </div>
      )}
    </>
  );
}
