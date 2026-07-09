"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Eye,
  MessageCircle,
  PauseCircle,
  Plus,
  Power,
  Send,
  Star,
  X,
} from "lucide-react";
import { bookings, formatCurrency, listings, revenueBars, type JetSkiListing } from "@/lib/data";
import { cn } from "@/lib/utils";

type LeadStatus = "À confirmer" | "Acceptée" | "Refusée";

type OwnerLead = {
  id: string;
  listingName: string;
  dateRange: string;
  location: string;
  estimate: number;
  client: string;
  status: LeadStatus;
};

type OwnerListing = JetSkiListing & {
  liveStatus: "active" | "paused";
};

const initialLeads: OwnerLead[] = [
  {
    id: "RW-7429",
    listingName: bookings[0].listingName,
    dateRange: bookings[0].dateRange,
    location: bookings[0].location,
    estimate: bookings[0].total,
    client: "Alex Martin",
    status: "À confirmer",
  },
  {
    id: "RW-7440",
    listingName: "Sea-Doo Wake Pro 230",
    dateRange: "26 juillet 2026",
    location: "Ottawa River",
    estimate: 1373,
    client: "Sofia Benali",
    status: "À confirmer",
  },
  {
    id: "RW-7502",
    listingName: "Yamaha FX HO Parc",
    dateRange: "2 août 2026",
    location: "Parc Jacques-Cartier",
    estimate: 1235,
    client: "Marc Dubois",
    status: "Acceptée",
  },
];

const statusStyles: Record<LeadStatus, string> = {
  "À confirmer": "bg-amber-50 text-amber-700",
  Acceptée: "bg-emerald-50 text-emerald-700",
  Refusée: "bg-rose-50 text-rose-700",
};

export function OwnerDashboard() {
  const [leads, setLeads] = useState(initialLeads);
  const [ownerListings, setOwnerListings] = useState<OwnerListing[]>(
    listings.slice(0, 5).map((listing) => ({ ...listing, liveStatus: "active" })),
  );
  const [selectedDay, setSelectedDay] = useState(18);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const activeListings = ownerListings.filter((listing) => listing.liveStatus === "active").length;
  const pendingLeads = leads.filter((lead) => lead.status === "À confirmer").length;
  const acceptedLeads = leads.filter((lead) => lead.status === "Acceptée").length;
  const estimatedPipeline = useMemo(
    () => leads.filter((lead) => lead.status !== "Refusée").reduce((sum, lead) => sum + lead.estimate, 0),
    [leads],
  );

  function updateLead(id: string, status: LeadStatus) {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  function toggleListing(slug: string) {
    setOwnerListings((current) =>
      current.map((listing) =>
        listing.slug === slug
          ? { ...listing, liveStatus: listing.liveStatus === "active" ? "paused" : "active" }
          : listing,
      ),
    );
  }

  function updatePrice(slug: string, pricePerDay: number) {
    setOwnerListings((current) =>
      current.map((listing) => (listing.slug === slug ? { ...listing, pricePerDay } : listing)),
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold text-cyan-700">Espace propriétaire</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Gérez vos demandes et annonces.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              MVP sans paiement : l’objectif est de capter des propriétaires, recevoir des demandes
              qualifiées et répondre vite aux clients.
            </p>
          </div>
          <Link
            href="/proprietaire/ajouter"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
          >
            <Plus size={18} />
            Ajouter un jet-ski
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Demandes à confirmer" value={`${pendingLeads}`} trend="Répondre vite" />
            <Metric label="Demandes acceptées" value={`${acceptedLeads}`} trend="Cette semaine" />
            <Metric label="Annonces actives" value={`${activeListings}`} trend={`${ownerListings.length} total`} />
            <Metric label="Potentiel estimé" value={formatCurrency(estimatedPipeline)} trend="Sans paiement en ligne" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Demandes clients</h2>
                <p className="mt-1 text-sm text-slate-500">Acceptez, refusez ou contactez avant confirmation finale.</p>
              </div>
              <Send className="text-cyan-700" size={26} />
            </div>
            <div className="mt-4 grid gap-3">
              {leads.map((lead) => (
                <article key={lead.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-cyan-700">{lead.id} · {lead.client}</p>
                      <h3 className="mt-1 font-bold text-slate-950">{lead.listingName}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {lead.dateRange} · {lead.location} · {formatCurrency(lead.estimate)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[lead.status])}>
                        {lead.status}
                      </span>
                      <Link
                        href="/messages"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700"
                      >
                        <MessageCircle size={16} />
                        Message
                      </Link>
                    </div>
                  </div>
                  {lead.status === "À confirmer" ? (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => updateLead(lead.id, "Acceptée")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white"
                      >
                        <Check size={16} />
                        Accepter
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLead(lead.id, "Refusée")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700"
                      >
                        <X size={16} />
                        Refuser
                      </button>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Mes annonces</h2>
            <div className="mt-4 grid gap-4">
              {ownerListings.map((listing) => {
                const editing = editingSlug === listing.slug;

                return (
                  <article key={listing.slug} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">{listing.name}</h3>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-bold",
                              listing.liveStatus === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {listing.liveStatus === "active" ? "Active" : "En pause"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{listing.location} · Weekend {formatCurrency(listing.weekendPrice)}</p>
                        {editing ? (
                          <label className="mt-3 grid max-w-xs gap-2 text-sm font-bold text-slate-700">
                            Prix par jour
                            <input
                              type="number"
                              value={listing.pricePerDay}
                              onChange={(event) => updatePrice(listing.slug, Number(event.target.value))}
                              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500"
                            />
                          </label>
                        ) : (
                          <p className="mt-2 text-lg font-bold text-slate-950">{formatCurrency(listing.pricePerDay)} / jour</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSlug(editing ? null : listing.slug)}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700"
                        >
                          <Edit3 size={16} />
                          {editing ? "Terminer" : "Modifier"}
                        </button>
                        <Link
                          href={`/jet-skis/${listing.slug}`}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700"
                        >
                          <Eye size={16} /> Voir
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleListing(listing.slug)}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700"
                        >
                          {listing.liveStatus === "active" ? <PauseCircle size={16} /> : <Power size={16} />}
                          {listing.liveStatus === "active" ? "Pause" : "Réactiver"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Calendrier</h2>
            <p className="mt-1 text-sm text-slate-500">Jour sélectionné : {selectedDay} juillet</p>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => {
                const day = index + 1;
                const booked = day % 6 === 0;
                const pending = day % 9 === 0;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      "grid aspect-square place-items-center rounded-lg text-sm font-bold transition",
                      selectedDay === day
                        ? "bg-[#073b5d] text-white"
                        : booked
                          ? "bg-cyan-50 text-cyan-800"
                          : pending
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Demandes reçues</h2>
            <div className="mt-5 flex h-44 items-end gap-2 rounded-lg bg-slate-50 p-3">
              {revenueBars.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-[#073b5d] to-cyan-400" style={{ height: `${value}%` }} />
                  <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Performance</h2>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-4">
              <Star className="text-amber-600" size={24} fill="currentColor" />
              <div>
                <p className="text-2xl font-bold text-slate-950">4.94</p>
                <p className="text-sm text-slate-600">Note moyenne propriétaire</p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-3xl font-bold text-slate-950">{value}</p>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
          {trend}
        </span>
      </div>
    </article>
  );
}
