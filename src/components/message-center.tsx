"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Search, Send, ShieldCheck } from "lucide-react";
import { type Conversation } from "@/lib/data";
import { cn } from "@/lib/utils";

type Message = Conversation["messages"][number];

export function MessageCenter({ conversations }: { conversations: Conversation[] }) {
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [draft, setDraft] = useState("");
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

  function sendMessage() {
    if (!draft.trim() || !active) return;
    const text = draft.trim();
    setDraft("");
    setMessagesById((current) => ({
      ...current,
      [active.id]: [...current[active.id], { from: "client", text, time: "Maintenant" }],
    }));
    window.setTimeout(() => {
      setMessagesById((current) => ({
        ...current,
        [active.id]: [
          ...current[active.id],
          {
            from: "host",
            text: "Bien reçu. Je confirme les détails et je reviens vers vous sous peu.",
            time: "À l'instant",
          },
        ],
      }));
    }, 700);
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
          {conversations.map((conversation) => (
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
          ))}
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
                Propriétaire vérifié
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                <Bell size={14} />
                Notifications
              </span>
            </div>
          </header>

          <div className="space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc,#ffffff)] p-4">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
              <p className="font-bold">Détails de réservation partagés</p>
              <p className="mt-1">Créneau, frais, lieu de remise et statut restent visibles dans la conversation.</p>
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
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                placeholder="Écrire un message"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="grid size-10 place-items-center rounded-full bg-[#073b5d] text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
                aria-label="Envoyer le message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </main>
      ) : null}
    </div>
  );
}
