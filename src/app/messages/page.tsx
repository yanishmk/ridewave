import { MessageCenter } from "@/components/message-center";
import { conversations } from "@/lib/data";

export default function MessagesPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Messagerie</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Échangez avec les propriétaires.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Conversations propres, réservations partagées, notifications et réponses simulées.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MessageCenter conversations={conversations} />
      </section>
    </div>
  );
}
