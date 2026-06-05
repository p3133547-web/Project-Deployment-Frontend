import { useState, useRef, useEffect } from "react";
import {
  Send, Bot, User, RotateCcw, Copy, ThumbsUp, ThumbsDown,
  Mic, Paperclip, Calendar, BookOpen, ClipboardList, AlertTriangle,
  Sparkles, Clock, TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: number; role: "user" | "ai"; content: string; ts: Date;
  liked?: boolean; bad?: boolean;
}

const GREETINGS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "good night", "greetings"];

const ACADEMIC_KW = [
  "attendance", "marks", "result", "grade", "cgpa", "sgpa", "gpa",
  "assignment", "deadline", "exam", "test", "quiz", "hall ticket",
  "timetable", "schedule", "holiday", "class", "course", "subject",
  "leave", "od", "internship", "announcement", "notice", "circular",
  "fee", "semester", "report", "retest", "internal", "practical",
  "academic", "college", "department", "faculty", "professor", "lecturer",
  "syllabus", "campus", "submission", "arrear", "backlog", "eligible",
  "rank", "percentile", "performance", "study", "learn",
];

function isAcademic(msg: string) {
  const l = msg.toLowerCase();
  if (GREETINGS.some(g => l === g || l.startsWith(g + " ") || l.startsWith(g + "!"))) return true;
  return ACADEMIC_KW.some(k => l.includes(k));
}

const responses: Record<string, string> = {
  greeting: `Hello! 👋 I'm your **Academic AI Assistant**.

I can help you with:
• **Attendance** — subject-wise & monthly reports
• **Marks & CGPA** — internal, practical, AU results
• **Timetable** — today's schedule and weekly view
• **Exams** — hall ticket, eligibility, registration
• **Holidays** — academic calendar & important dates
• **Assignments** — deadlines and submission status
• **Leave & OD** — request status and approvals
• **Announcements** — latest circulars and notices

What would you like to know today?`,

  attendance: `📊 **Your Attendance Summary — Semester 5:**

| Subject | Code | Present | Total | % |
|---------|------|---------|-------|---|
| Data Structures | CS301 | 44 | 48 | **92%** ✅ |
| Web Technologies | CS302 | 44 | 50 | **88%** ✅ |
| Computer Networks | CS303 | 36 | 46 | **78%** ⚠️ |
| Operating Systems | CS304 | 44 | 52 | **85%** ✅ |
| Machine Learning | CS305 | 36 | 40 | **90%** ✅ |

**Overall Attendance: 87.5%** — All subjects eligible (≥75%)

⚠️ Computer Networks is borderline — do not miss more than 2 classes!`,

  marks: `📝 **Internal Marks — Semester 5:**

| Subject | CT1 | CT2 | Assign | Practical | Total |
|---------|-----|-----|--------|-----------|-------|
| Data Structures | 22/25 | 20/25 | 9/10 | 18/20 | **78/100** |
| Web Technologies | 23/25 | 22/25 | 10/10 | 19/20 | **83/100** |
| Computer Networks | 18/25 | 18/25 | 8/10 | 15/20 | **68/100** |
| Operating Systems | 20/25 | 20/25 | 9/10 | 17/20 | **74/100** |
| Machine Learning | 24/25 | 23/25 | 10/10 | 19/20 | **89/100** |

**Best Subject:** Machine Learning (89/100 · A+)
**Needs Improvement:** Computer Networks (68/100 · B+)`,

  holidays: `📅 **Academic Calendar — Spring 2026:**

**Upcoming Holidays:**
• Apr 14 — Spring Recess begins 🌸
• Apr 18 — Good Friday (National Holiday)
• Apr 20 — Spring Recess ends
• May 1 — International Labour Day
• May 27 — Commencement Day

**Important Dates:**
• Apr 17 — Last day to withdraw from courses
• Apr 25 — Exam registration deadline
• Apr 30 — Last class day (Spring 2026)
• May 2–9 — Final Examination Week
• May 16 — Grades due from Faculty
• May 22 — Commencement Ceremony 🎓

Check the Academic Calendar page for full details.`,

  timetable: `🗓 **Today's Class Schedule — III CSE A:**

| Time | Subject | Room | Type |
|------|---------|------|------|
| 09:00 AM | Data Structures Lab | Lab 2 | 🧪 Lab |
| 11:00 AM | Machine Learning | A-201 | 📚 Theory |
| 12:00 PM | Lunch Break | — | — |
| 02:00 PM | Web Technologies | A-205 | 📚 Theory |
| 03:00 PM | Computer Networks | B-101 | 📚 Theory |

**Total today:** 4 sessions (1 lab + 3 theory)
Next class: Data Structures Lab at 09:00 AM (Lab 2)`,

  assignments: `📋 **Upcoming Assignment Deadlines:**

🔴 **Urgent (Due in 1-2 days):**
• Data Structures Lab Report — **Due Apr 12** (Tomorrow!)
  Status: Submitted ✅

🟡 **This Week:**
• Web Tech Mini Project — Due Apr 16
  Status: 45% complete

🟢 **Upcoming:**
• ML Assignment #3 — Due Apr 20
  Status: Not started
• Networks Case Study — Due Apr 25
  Status: Not started

**Tip:** Start the ML Assignment before the spring recess!`,

  cgpa: `🎓 **Your Academic Performance:**

• **Current CGPA: 8.4 / 10** 🌟
• **Current SGPA (Sem 5): 8.7 / 10** ↑
• **Class Rank: #12** of 68 students
• **Department Percentile: 82nd**

**CGPA Progression:**
Sem 1: 7.8 → Sem 2: 8.1 → Sem 3: 8.0 → Sem 4: 8.3 → **Sem 5: 8.4**

You have consistently improved! Keep targeting above 8.5 for an A grade distinction.`,

  exam: `📝 **End Semester Exam Information:**

• **Exam Start Date:** May 5, 2026
• **Registration Deadline:** April 25, 2026
• **Hall Ticket Available:** April 30, 2026

**Your Eligibility Status:**
• Data Structures (CS301) — ✅ Eligible (92%)
• Web Technologies (CS302) — ✅ Eligible (88%)
• Computer Networks (CS303) — ✅ Eligible (78%)
• Operating Systems (CS304) — ✅ Eligible (85%)
• Machine Learning (CS305) — ✅ Eligible (90%)

**Fee Status:** Paid ✅ | **Arrears:** None

Visit the **Hall Ticket** section to download your admit card from April 30.`,

  leave: `📝 **Leave & OD Summary:**

• **Approved Leaves:** 2 days (Medical)
• **OD Credits Used:** 1 day (Hackathon)
• **Remaining Leaves:** 8 / 15
• **Pending Requests:** 1 (Medical · Apr 14)

**Recent Leave History:**
• Mar 28 — Medical Leave (2 days) ✅ Approved
• Apr 3 — OD for Hackathon (1 day) ✅ Approved
• Apr 14 — Medical Leave (1 day) ⏳ Pending

Your advisor will review the pending request within 24 hours.`,

  announcement: `📢 **Latest Announcements:**

1. 🔴 **Exam Registration Open** — Deadline: Apr 25
2. 🟡 **TCS Placement Drive** — Apr 22 (Register by Apr 18)
3. 🔵 **CT2 Results Published** — Check Marks section
4. 🟢 **Guest Lecture: AI in Industry** — Apr 15, Seminar Hall
5. 🟠 **Library Fine Clearance** — Deadline: Apr 20

Check your **Inbox** for complete details on each announcement.`,

  fee: `💰 **Fee Status — Spring 2026:**

| Fee Type | Amount | Status |
|----------|--------|--------|
| Tuition Fee | ₹45,000 | ✅ Paid |
| Examination Fee | ₹1,200 | ✅ Paid |
| Hostel Fee | ₹18,000 | ✅ Paid |
| Library Fine | ₹0 | — |

**All dues cleared.** No pending payments.
Next fee cycle begins in July 2026.`,

  internship: `💼 **Internship Status:**

**Current:** No active internship

**Past Internships:**
• Infosys InStep Program — Jun–Jul 2025 (8 weeks)
  Status: Completed ✅ | Certificate: Available

**Upcoming Opportunities:**
• TCS iON Digital Internship — Registrations open
• Infosys Summer 2026 — Apply via Internship Portal
• Google STEP Program — Deadline May 1

OD balance available: 5 days for internship purposes.`,

  nonAcademic: `⚠️ **This query is irrelevant to academic activities.**

Please ask an academic-related question. I can assist with:

• Attendance & eligibility
• Marks, grades & CGPA
• Exam schedule & hall ticket
• Timetable & schedule
• Academic calendar & holidays
• Assignments & deadlines
• Leave & OD requests
• Announcements & circulars
• Fee status
• Internship information

**Example:** "What is my attendance percentage?" or "When is the next exam?"`,

  default: `I understand you're asking about academics. Could you be more specific?

Here are some things I can help with:
• **"What is my attendance?"** — View all subject attendance
• **"Show my marks"** — Internal assessment scores
• **"When are the holidays?"** — Academic calendar
• **"Am I eligible for exams?"** — Eligibility check
• **"What assignments are pending?"** — Deadlines
• **"Show today's timetable"** — Schedule
• **"What is my CGPA?"** — Performance metrics

Please ask a specific question and I'll provide detailed information!`,
};

function getResponse(msg: string): { content: string; bad: boolean } {
  const l = msg.toLowerCase();
  if (!isAcademic(msg)) return { content: responses.nonAcademic, bad: true };
  if (GREETINGS.some(g => l === g || l.startsWith(g + " ") || l.startsWith(g + "!"))) return { content: responses.greeting, bad: false };
  if (l.includes("attendance")) return { content: responses.attendance, bad: false };
  if (l.includes("marks") || l.includes("internal") || l.includes("ct") || l.includes("practical")) return { content: responses.marks, bad: false };
  if (l.includes("holiday") || l.includes("calendar") || l.includes("break") || l.includes("recess")) return { content: responses.holidays, bad: false };
  if (l.includes("timetable") || l.includes("schedule") || l.includes("today")) return { content: responses.timetable, bad: false };
  if (l.includes("assignment") || l.includes("deadline") || l.includes("submission")) return { content: responses.assignments, bad: false };
  if (l.includes("cgpa") || l.includes("sgpa") || l.includes("gpa") || l.includes("grade") || l.includes("result") || l.includes("rank")) return { content: responses.cgpa, bad: false };
  if (l.includes("exam") || l.includes("hall ticket") || l.includes("eligible") || l.includes("eligibility")) return { content: responses.exam, bad: false };
  if (l.includes("leave") || l.includes("od") || l.includes("absent")) return { content: responses.leave, bad: false };
  if (l.includes("announcement") || l.includes("notice") || l.includes("circular")) return { content: responses.announcement, bad: false };
  if (l.includes("fee") || l.includes("payment") || l.includes("dues")) return { content: responses.fee, bad: false };
  if (l.includes("internship")) return { content: responses.internship, bad: false };
  return { content: responses.default, bad: false };
}

function formatMsg(content: string) {
  return content.split("\n").map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const fmt = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);
    return <span key={i}>{fmt}{i < arr.length - 1 && <br />}</span>;
  });
}

const chips = [
  { icon: <Calendar className="w-4 h-4" />, text: "What are the upcoming holidays?" },
  { icon: <ClipboardList className="w-4 h-4" />, text: "Show my attendance" },
  { icon: <BookOpen className="w-4 h-4" />, text: "What are my internal marks?" },
  { icon: <Clock className="w-4 h-4" />, text: "Show today's timetable" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "What is my CGPA?" },
  { icon: <Sparkles className="w-4 h-4" />, text: "Am I eligible for exams?" },
];

export function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([{
    id: 0, role: "ai", ts: new Date(), bad: false,
    content: `Hello ${user?.name?.split(" ")[0] ?? "there"}! 👋 I'm your **Academic AI Assistant** — powered by Graph RAG technology.\n\nI can answer questions about your **attendance, marks, CGPA, timetable, exams, holidays, assignments, leave status**, and more.\n\nNote: I only respond to academic queries. Non-academic questions will not be entertained.\n\nHow can I help you today?`,
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || typing) return;
    setInput("");
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: t, ts: new Date() }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    const { content, bad } = getResponse(t);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: "ai", content, ts: new Date(), bad }]);
    setTyping(false);
  };

  const toggleLike = (id: number, liked: boolean) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked } : m));

  const clearChat = () => setMessages([{
    id: Date.now(), role: "ai", ts: new Date(), bad: false,
    content: `New conversation started. Hi ${user?.name?.split(" ")[0] ?? "there"}! 👋 How can I help you with your academic queries today?`,
  }]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>Academic AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-400 text-xs">Online · Graph RAG · Academic queries only</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl" style={{ fontWeight: 500 }}>
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered
          </span>
          <button onClick={clearChat}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
            style={{ fontWeight: 500 }}>
            <RotateCcw className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "ai"
                  ? msg.bad ? "bg-amber-100" : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm"
                  : "bg-slate-200"
              }`}>
                {msg.role === "ai"
                  ? msg.bad ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-slate-600" />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : msg.bad
                    ? "bg-amber-50 border border-amber-200 text-slate-700 rounded-tl-sm shadow-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.bad && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="text-amber-700 text-xs" style={{ fontWeight: 600 }}>Non-Academic Query</span>
                    </div>
                  )}
                  {formatMsg(msg.content)}
                </div>
                <div className={`flex items-center gap-2 mt-1.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className="text-slate-400 text-xs">{msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.role === "ai" && !msg.bad && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Copy">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={() => toggleLike(msg.id, true)} className={`p-1 rounded-md transition-colors ${msg.liked === true ? "text-emerald-500" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}>
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => toggleLike(msg.id, false)} className={`p-1 rounded-md transition-colors ${msg.liked === false ? "text-red-500" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}>
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 pb-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-500 text-xs mb-2.5" style={{ fontWeight: 500 }}>Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <button key={i} onClick={() => send(c.text)}
                  className="flex items-center gap-1.5 text-sm text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-all"
                  style={{ fontWeight: 500 }}>
                  <span className="text-indigo-500">{c.icon}</span>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 p-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask about attendance, marks, timetable, exams, holidays…"
              rows={1} style={{ resize: "none", fontSize: 14 }}
              className="flex-1 bg-transparent text-slate-700 placeholder:text-slate-400 outline-none min-h-[24px] max-h-32 overflow-y-auto leading-relaxed"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"><Mic className="w-4 h-4" /></button>
              <button onClick={() => send()} disabled={!input.trim() || typing}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${input.trim() && !typing ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">
            Academic AI responds only to academic queries. Non-academic questions will receive a redirect message.
          </p>
        </div>
      </div>
    </div>
  );
}
