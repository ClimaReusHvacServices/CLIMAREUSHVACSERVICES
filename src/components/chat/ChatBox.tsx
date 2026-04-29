"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export interface ChatComment {
  id: string;
  content: string;
  createdAt: Date | string;
  author: { firstName: string; lastName: string; role: string };
}

const ROLE_PILL: Record<string, string> = {
  admin:      "bg-primary-100 text-primary-700",
  trabajador: "bg-amber-100 text-amber-700",
  cliente:    "bg-gray-100 text-gray-600",
};
const ROLE_LABEL: Record<string, string> = {
  admin:      "Admin",
  trabajador: "Técnico",
  cliente:    "Cliente",
};

// Which role's bubbles go on the right
const BUBBLE_RIGHT: Record<string, string> = {
  admin:      "bg-primary-600 text-white rounded-tr-sm",
  trabajador: "bg-amber-500 text-white rounded-tr-sm",
  cliente:    "bg-indigo-500 text-white rounded-tr-sm",
};

interface ChatBoxProps {
  orderId: string;
  initialComments: ChatComment[];
  myRole: string;
  locale: string;
  disabled?: boolean;
  placeholder?: string;
  onSend: (content: string) => Promise<void>;
  /** Optional extra content in the header */
  headerExtra?: React.ReactNode;
}

export function ChatBox({
  orderId,
  initialComments,
  myRole,
  locale,
  disabled = false,
  placeholder = "Escribe un mensaje...",
  onSend,
  headerExtra,
}: ChatBoxProps) {
  const [comments, setComments] = useState<ChatComment[]>(initialComments);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestIdRef = useRef<string>(initialComments[initialComments.length - 1]?.id ?? "");

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  // Polling every 5 seconds — only fetches messages, not full page
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      const fetched: ChatComment[] = data.comments ?? [];
      const lastId = fetched[fetched.length - 1]?.id ?? "";
      if (lastId !== latestIdRef.current) {
        latestIdRef.current = lastId;
        setComments(fetched);
      }
    } catch {}
  }, [orderId]);

  useEffect(() => {
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [poll]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = msg.trim();
    if (!text || sending) return;

    // Optimistic update
    const optimistic: ChatComment = {
      id: `temp-${Date.now()}`,
      content: text,
      createdAt: new Date(),
      author: { firstName: "Tú", lastName: "", role: myRole },
    };
    setComments(prev => [...prev, optimistic]);
    setMsg("");
    setSending(true);

    try {
      await onSend(text);
      // Fetch real data after send
      await poll();
    } catch {
      // Rollback optimistic
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
      setMsg(text);
      toast.error("Error al enviar");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-3 border-b border-gray-100 flex items-center gap-2"
        style={{ background: "linear-gradient(to right, #008f6508, #1d729108)" }}
      >
        <MessageSquare size={15} className="text-primary-600" />
        <h2 className="text-sm font-bold text-gray-900">Chat del pedido</h2>
        <span className="text-xs text-gray-400">
          {comments.length} mensaje{comments.length !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          en vivo
        </span>
        {headerExtra}
      </div>

      {/* Messages */}
      <div className="p-5 space-y-3 max-h-80 overflow-y-auto overscroll-contain">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={32} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm text-gray-400">
              {disabled ? "Chat cerrado." : "Sin mensajes. Sé el primero en escribir."}
            </p>
          </div>
        ) : (
          comments.map(comment => {
            const isMe = comment.author.role === myRole;
            const bubbleClass = isMe
              ? BUBBLE_RIGHT[myRole] ?? "bg-gray-200 text-gray-800 rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm";
            const isTemp = comment.id.startsWith("temp-");

            return (
              <div key={comment.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""} ${isTemp ? "opacity-70" : ""}`}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white mt-1"
                  style={{
                    background: comment.author.role === "admin"
                      ? "linear-gradient(to right, #008f65, #1d7291)"
                      : comment.author.role === "trabajador"
                        ? "linear-gradient(to right, #f59e0b, #d97706)"
                        : "linear-gradient(to right, #6366f1, #8b5cf6)",
                  }}
                >
                  {(comment.author.firstName[0] + (comment.author.lastName[0] ?? "")).toUpperCase()}
                </div>

                <div className={`max-w-xs lg:max-w-sm flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-700">
                      {isMe && comment.id.startsWith("temp-") ? "Tú" : `${comment.author.firstName} ${comment.author.lastName}`}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${ROLE_PILL[comment.author.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {ROLE_LABEL[comment.author.role] ?? comment.author.role}
                    </span>
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-sm ${bubbleClass}`}>
                    {comment.content}
                  </div>
                  <p className="text-[9px] text-gray-400">
                    {new Date(comment.createdAt).toLocaleString(locale, {
                      hour: "2-digit", minute: "2-digit",
                      day: "2-digit", month: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      {!disabled && (
        <form onSubmit={handleSend} className="px-5 py-4 border-t border-gray-100 flex gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 bg-white transition-shadow"
          />
          <button
            type="submit"
            disabled={!msg.trim() || sending}
            className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 shrink-0 hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {sending
              ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send size={16} />}
          </button>
        </form>
      )}
    </div>
  );
}
