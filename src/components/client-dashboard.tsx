"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  MessageCircle,
  Pencil,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  bookings,
  conversations,
  formatCurrency,
  listings,
  type Booking,
  type BookingStatus,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  "En attente": "bg-amber-50 text-amber-700",
  Confirmée: "bg-emerald-50 text-emerald-700",
  Terminée: "bg-slate-100 text-slate-700",
  Annulée: "bg-rose-50 text-rose-700",
  "À venir aujourd'hui": "bg-cyan-50 text-cyan-700",
};

const initialBookings: Booking[] = [
  ...bookings,
  {
    id: "RW-7440",
    listingSlug: "sea-doo-wake-pro-ottawa-river",
    listingName: "Sea-Doo Wake Pro 230",
    dateRange: "26 juillet 2026",
    status: "En attente",
    location: "Ottawa River",
    total: 1373,
    mode: "Livraison",
  },
];

type DashboardTab = "demandes" | "favoris" | "messages" | "profil";

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("demandes");
  const [requests, setRequests] = useState(initialBookings);
  const [favoriteSlugs, setFavoriteSlugs] = useState(
    listings.slice(0, 4).map((listing) => listing.slug),
  );
  const [profile, setProfile] = useState({
    name: "Alex Martin",
    phone: "+1 613 555 0101",
    email: "alex@exemple.ca",
    boatingCard: "À vérifier",
    preference: "Livraison au quai",
  });

  const favorites = useMemo(
    () => listings.filter((listing) => favoriteSlugs.includes(listing.slug)),
    [favoriteSlugs],
  );

  const pendingCount = requests.filter((request) => request.status === "En attente").length;
  const upcomingCount = requests.filter(
    (request) => request.status === "Confirmée" || request.status === "À venir aujourd'hui",
  ).length;

  function cancelRequest(id: string) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "Annulée" as BookingStatus } : request,
      ),
    );
  }

  function removeFavorite(slug: string) {
    setFavoriteSlugs((current) => current.filter((item) => item !== slug));
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Espace client</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Bonjour {profile.name}, vos demandes sont suivies ici.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Gérez vos demandes, favoris, messages et informations sans paiement au lancement.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <main className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={<CalendarDays size={22} />} label="Sorties à venir" value={`${upcomingCount}`} />
            <Metric icon={<Send size={22} />} label="Demandes en attente" value={`${pendingCount}`} />
            <Metric icon={<Heart size={22} />} label="Favoris" value={`${favorites.length}`} />
          </div>

          <nav className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:grid-cols-4">
            {[
              ["demandes", "Demandes"],
              ["favoris", "Favoris"],
              ["messages", "Messages"],
              ["profil", "Profil"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as DashboardTab)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-bold transition",
                  activeTab === tab ? "bg-[#073b5d] text-white" : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          {activeTab === "demandes" ? (
            <Panel title="Mes demandes">
              <div className="grid gap-3">
                {requests.map((request) => (
                  <article key={request.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-cyan-700">{request.id}</p>
                        <h2 className="mt-1 text-lg font-bold text-slate-950">{request.listingName}</h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {request.dateRange} · {request.location} · {request.mode}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[request.status])}>
                          {request.status}
                        </span>
                        <span className="text-sm font-bold text-slate-950">{formatCurrency(request.total)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/messages"
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <MessageCircle size={16} />
                        Contacter
                      </Link>
                      {request.status === "En attente" ? (
                        <button
                          type="button"
                          onClick={() => cancelRequest(request.id)}
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle size={16} />
                          Annuler la demande
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "favoris" ? (
            <Panel title="Jet-skis favoris">
              {favorites.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {favorites.map((listing) => (
                    <article key={listing.slug} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-bold text-slate-950">{listing.name}</h2>
                          <p className="mt-1 text-sm text-slate-600">
                            {listing.location} · {formatCurrency(listing.pricePerDay)} / jour
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFavorite(listing.slug)}
                          className="grid size-10 place-items-center rounded-full bg-rose-50 text-rose-700"
                          aria-label={`Retirer ${listing.name} des favoris`}
                        >
                          <Heart size={17} fill="currentColor" />
                        </button>
                      </div>
                      <Link
                        href={`/jet-skis/${listing.slug}`}
                        className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#073b5d] px-4 text-sm font-bold text-white"
                      >
                        Voir l&apos;annonce
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="Aucun favori" copy="Ajoutez des jet-skis depuis la page Explorer pour les retrouver ici." />
              )}
            </Panel>
          ) : null}

          {activeTab === "messages" ? (
            <Panel title="Messages propriétaires">
              <div className="grid gap-3">
                {conversations.map((conversation) => (
                  <Link
                    key={conversation.id}
                    href="/messages"
                    className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-cyan-200"
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
                  </Link>
                ))}
              </div>
            </Panel>
          ) : null}

          {activeTab === "profil" ? (
            <Panel title="Profil et préférences">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileInput label="Nom complet" value={profile.name} onChange={(name) => setProfile({ ...profile, name })} />
                <ProfileInput label="Téléphone" value={profile.phone} onChange={(phone) => setProfile({ ...profile, phone })} />
                <ProfileInput label="Courriel" value={profile.email} onChange={(email) => setProfile({ ...profile, email })} />
                <ProfileInput label="Carte conducteur" value={profile.boatingCard} onChange={(boatingCard) => setProfile({ ...profile, boatingCard })} />
                <ProfileInput label="Préférence" value={profile.preference} onChange={(preference) => setProfile({ ...profile, preference })} />
              </div>
              <div className="mt-5 rounded-lg bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
                Ces champs sont simulés pour le MVP. Ils sont prêts à être reliés à Supabase Auth et à une table profils.
              </div>
            </Panel>
          ) : null}
        </main>

        <aside className="space-y-6">
          <Panel title="Profil">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-[#073b5d] font-bold text-white">AM</span>
              <div>
                <p className="font-bold text-slate-950">{profile.name}</p>
                <p className="text-sm text-slate-500">Client vérifié bientôt</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} /> Profil complet à 86%
              </span>
              <span className="inline-flex items-center gap-2">
                <Pencil size={16} /> Préférence : {profile.preference}
              </span>
            </div>
          </Panel>

          <Panel title="Prochaine action">
            <div className="rounded-lg bg-[#073b5d] p-5 text-white">
              <p className="text-sm font-bold text-cyan-100">MVP sans paiement</p>
              <p className="mt-3 text-2xl font-bold">Répondre vite</p>
              <p className="mt-2 text-sm text-cyan-50">
                Le meilleur levier de conversion au lancement : propriétaires réactifs, prix clairs et messages simples.
              </p>
              <Link
                href="/explorer"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-[#073b5d]"
              >
                Explorer plus d&apos;annonces
              </Link>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-cyan-700">{icon}</div>
      <p className="mt-4 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{copy}</p>
    </div>
  );
}
