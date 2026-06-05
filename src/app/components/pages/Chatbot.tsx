import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  ClipboardList,
  Calendar,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Mic,
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  liked?: boolean;
}

const suggestions = [
  { icon: <Calendar className="w-4 h-4" />, text: "What assignments are due this week?" },
  { icon: <BookOpen className="w-4 h-4" />, text: "Explain binary search trees" },
  { icon: <ClipboardList className="w-4 h-4" />, text: "How can I improve my ML grade?" },
  { icon: <Sparkles className="w-4 h-4" />, text: "Summarize today's lecture notes" },
];

const aiResponses: Record<string, string> = {
  default: `I'm AcademiX AI, your academic assistant! I can help you with:

• **Assignment questions** – deadlines, requirements, submission help
• **Study tips** – how to approach difficult topics
• **Course materials** – explanations of concepts
• **Progress tracking** – your grades and performance

What would you like to know?`,

  assignments: `You have **3 upcoming assignments** this week:

1. 📋 **Binary Trees Implementation** (CS301)
   - Due: **Tomorrow, Apr 10** ���️ Urgent
   - Status: 60% complete

2. 📄 **Model Evaluation Report** (CS445)
   - Due: Apr 13
   - Status: 35% complete

3. 🧪 **Process Scheduling Lab** (CS330)
   - Due: Apr 17
   - Status: Not started

I'd recommend finishing the Binary Trees assignment today since it's due tomorrow!`,

  binary: `Great question! **Binary Search Trees (BST)** are a fundamental data structure.

**Key Properties:**
- Each node has at most 2 children
- Left child < parent < right child
- Enables efficient search in **O(log n)** average time

**Core Operations:**
\`\`\`
Insert, Search, Delete — all O(log n) average
\`\`\`

**Traversal Methods:**
- **Inorder (LNR):** Gives sorted output
- **Preorder (NLR):** Root first
- **Postorder (LRN):** Root last

For your CS301 assignment, make sure to implement all three traversals and handle edge cases like deleting a node with two children (use the **inorder successor**).`,

  grade: `Here are some tips to improve your **Machine Learning grade** (currently 87%):

**Short-term (Before Apr 13 Report):**
1. ✅ Focus on proper cross-validation implementation
2. 📊 Use precision, recall, F1-score, AND ROC-AUC
3. 📝 Include confusion matrices for each model

**Study Resources:**
- Review sklearn's model_selection module
- Scikit-learn docs on evaluation metrics
- Khan Academy's statistics refresher

**Common Mistakes to Avoid:**
- Don't train/test on the same data
- Always set random_state for reproducibility
- Include baseline comparison

You're close to an A — just needs more rigor in evaluation! 💪`,

  lecture: `Here's a summary of today's key topics across your courses:

📚 **CS301 – Data Structures**
Tree rotations and AVL tree balancing

📚 **CS445 – Machine Learning**
Ensemble methods: Random Forests & Boosting

📚 **CS330 – Operating Systems**
Deadlock detection and prevention algorithms

📚 **CS420 – Computer Networks**
BGP routing and autonomous systems

Would you like me to go deeper on any of these topics?`,
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("assignment") || lower.includes("due") || lower.includes("deadline")) {
    return aiResponses.assignments;
  }
  if (lower.includes("binary") || lower.includes("tree") || lower.includes("bst")) {
    return aiResponses.binary;
  }
  if (lower.includes("grade") || lower.includes("ml") || lower.includes("machine learning") || lower.includes("improve")) {
    return aiResponses.grade;
  }
  if (lower.includes("lecture") || lower.includes("notes") || lower.includes("summary")) {
    return aiResponses.lecture;
  }
  return aiResponses.default;
}

function formatContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    // Bold text
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const formatted = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return (
      <span key={i}>
        {formatted}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: aiResponses.default,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: getResponse(messageText),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleLike = (id: number, liked: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked } : m))
    );
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: aiResponses.default,
        timestamp: new Date(),
      },
    ]);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>AcademiX AI</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-slate-400 text-xs">Online · Academic Assistant</p>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          style={{ fontWeight: 500 }}
        >
          <RotateCcw className="w-3.5 h-3.5" /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm"
                  : "bg-slate-200"
              }`}>
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-slate-600" />
                )}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {formatContent(msg.content)}
                </div>

                {/* Timestamp + actions */}
                <div className={`flex items-center gap-2 mt-1.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <span className="text-slate-400 text-xs">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyText(msg.content)}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleLike(msg.id, true)}
                        className={`p-1 rounded-md transition-colors ${msg.liked === true ? "text-emerald-500" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                        title="Helpful"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleLike(msg.id, false)}
                        className={`p-1 rounded-md transition-colors ${msg.liked === false ? "text-red-500" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestion chips (shown when only initial message) */}
      {messages.length === 1 && (
        <div className="flex-shrink-0 px-4 sm:px-6 pb-2">
          <div className="max-w-3xl mx-auto">
            <p className="text-slate-500 text-xs mb-2" style={{ fontWeight: 500 }}>Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
                  style={{ fontWeight: 500 }}
                >
                  <span className="text-blue-500">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 p-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your courses, assignments, or study tips..."
              rows={1}
              style={{ resize: "none", fontSize: 14 }}
              className="flex-1 bg-transparent text-slate-700 placeholder:text-slate-400 outline-none min-h-[24px] max-h-32 overflow-y-auto leading-relaxed"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !loading
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">
            AcademiX AI may make mistakes. Verify important academic information with your instructor.
          </p>
        </div>
      </div>
    </div>
  );
}
