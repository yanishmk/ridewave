"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Search, Send, ShieldCheck } from "lucide-react";
import type { DashboardConversation } from "@/lib/dashboard-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type Message = DashboardConversation["messages"][number];

export function MessageCenter({ conversations }: { conversations: DashboardConversation[] }) {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [messagesById, setMessagesById] = useState<Record<string, Message[]>>(() =>
    conversations.reduce<Record<string, Message[]>>((acc, conversation) => {
      acc[conversation.id] = conversation.messages;
      return acc;
    }, {}),
  );

  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
    [activeId, conversations],
  );

  async function sendMessage() {
    if (!draft.trim() || !active) return;

    const text = draft.trim();
    setDraft("");
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Vous devez être connecté pour envoyer un message.");
      setDraft(text);
      return;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: active.id,
      sender_id: user.id,
      body: text,
    });

    if (insertError) {
      setError("Impossible d'envoyer ce message pour le moment.");
      setDraft(text);
      return;
    }

    setMessagesById((current) => ({
      ...current,
      [active.id]: [...(current[active.id] ?? []), { from: "client", text, time: "Maintenant" }],
    }));
  }

  return (
    <div className="grid min-h-[680px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[340px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 bg-white p-4">
          <h1 className="text-xl font-bold text-slate-950">Messages</h1>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
            <Search size={17} className="text-slate-400" />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Rechercher" />
          </label>
        </div>
        <div className="grid">
          {conversations.length ? (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => setActiveId(conversation.id)}
                className={cn(
                  "border-b border-slate-200 p-4 text-left transition hover:bg-white",
                  active?.id === conversation.id && "bg-white",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{conversation.host}</p>
                    <p className="mt-1 text-sm text-slate-600">{conversation.listing}</p>
                  </div>
                  {conversation.unread ? (
                    <span className="grid size-7 place-items-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                      {conversation.unread}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  {conversation.status}
                </p>
              </button>
            ))
          ) : (
            <div className="p-5 text-sm font-semibold text-slate-600">
              Aucune conversation réelle pour le moment.
            </div>
          )}
        </div>
      </aside>

      {active ? (
        <main className="grid grid-rows-[auto_1fr_auto]">
          <header className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">{active.host}</h2>
              <p className="text-sm text-slate-600">{active.listing}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <ShieldCheck size={14} />
                Compte connecté
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                <Bell size={14} />
                Notifications
              </span>
            </div>
          </header>

          <div className="space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc,#ffffff)] p-4">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
              <p className="font-bold">Conversation réelle</p>
              <p className="mt-1">Les messages envoyés ici sont enregistrés dans Supabase.</p>
            </div>
            {(messagesById[active.id] ?? []).map((message, index) => (
              <div
                key={`${message.time}-${index}`}
                className={cn("flex", message.from === "client" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[82%] rounded-lg px-4 py-3 text-sm shadow-sm",
                    message.from === "client"
                      ? "bg-[#073b5d] text-white"
                      : "border border-slate-200 bg-white text-slate-700",
                  )}
                >
                  <p>{message.text}</p>
                  <p className={cn("mt-2 text-xs", message.from === "client" ? "text-cyan-100" : "text-slate-400")}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4">
            {error ? <p className="mb-3 text-sm font-bold text-rose-700">{error}</p> : null}
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void sendMessage();
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                placeholder="Écrire un message"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                className="grid size-10 place-items-center rounded-full bg-[#073b5d] text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
                aria-label="Envoyer le message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="grid place-items-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Aucune conversation</h2>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              Les conversations apparaîtront après une demande ou un échange avec un propriétaire.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
