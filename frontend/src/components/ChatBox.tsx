"use client";

console.log("we are in chatbox")
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  userId: string;
  token: string;
  onClose: () => void;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://todo-app-1-cgpr.onrender.com";

// ✅ Helper: ALWAYS convert anything to string safely
function toShortId(id: unknown) {
  if (id === null || id === undefined) return null;
  const s = String(id);
  return s.length > 8 ? s.slice(0, 8) + "…" : s;
}

export default function ChatBox({ userId, token, onClose }: Props) {
  // ✅ Debug: if you do NOT see this in console, Next is not running this file
  useEffect(() => {
    console.log("✅ ChatBox LOADED (new version)");
  }, []);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! Tell me what you want to do — e.g. “Add a task to buy groceries tomorrow.”",
    },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const shortConversationId = useMemo(
    () => toShortId(conversationId),
    [conversationId],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch(`${API_BASE}/api/${userId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId, // null => backend creates new
        }),
      });

      const raw = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${raw}`);
      }

      const data = raw ? JSON.parse(raw) : {};

      // ✅ FORCE string always (fixes slice crash forever)
      if (data?.conversation_id !== undefined && data?.conversation_id !== null) {
        setConversationId(String(data.conversation_id));
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.response ?? "OK",
        },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `I couldn't reach the backend at ${API_BASE}.\n\n` +
            `Error: ${e?.message ?? String(e)}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[70] w-[360px] max-w-[92vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div>
          <div className="font-semibold text-gray-900">Todo Assistant</div>
          <div className="text-xs text-gray-500">
            {shortConversationId
              ? `Conversation: ${shortConversationId}`
              : "New conversation"}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[82%] rounded-2xl px-3 py-2 text-sm bg-white border border-gray-200 text-gray-600">
              Typing…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}