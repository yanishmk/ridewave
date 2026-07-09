"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
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
import type {
  OwnerDashboardData,
  OwnerLead,
  OwnerListingDashboard,
} from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { RentalRequestStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<RentalRequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  declined: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-700",
  completed: "bg-slate-100 text-slate-700",
};

const statusLabels: Record<RentalRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Refusée",
  cancelled: "Annulée",
  completed: "Terminée",
};

export function OwnerDashboard({ data }: { data: OwnerDashboardData }) {
  const [leads, setLeads] = useState<OwnerLead[]>(data.leads);
  const [ownerListings, setOwnerListings] = useState<OwnerListingDashboard[]>(data.listings);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const activeListings = ownerListings.filter((listing) => listing.status === "active").length;
  const pendingLeads = leads.filter((lead) => lead.status === "pending").length;
  const acceptedLeads = leads.filter((lead) => lead.status === "accepted").length;
  const estimatedPipeline = useMemo(
    () =>
      leads
        .filter((lead) => lead.status !== "declined" && lead.status !== "cancelled")
        .reduce((sum, lead) => sum + lead.estimate, 0),
    [leads],
  );
  const averageRating = ownerListings.length
    ? ownerListings.reduce((sum, listing) => sum + listing.rating, 0) / ownerListings.length
    : 0;
  const hasDemandBars = data.demandBars.some((value) => value > 0);

  async function updateLead(id: string, status: Extract<RentalRequestStatus, "accepted" | "declined">) {
    setBusyId(id);
    setNotice(null);

    const { error } = await supabase
      .from("rental_requests")
      .update({ status })
      .eq("id", id)
      .eq("owner_id", data.profile.id);

    setBusyId(null);

    if (error) {
      setNotice("Impossible de mettre à jour cette demande pour le moment.");
      return;
    }

    setLeads((current) =>
      current.map((lead) =>
        lead.id === id ? { ...lead, status, statusLabel: statusLabels[status] } : lead,
      ),
    );
  }

  async function toggleListing(slug: string) {
    const listing = ownerListings.find((item) => item.slug === slug);
    if (!listing) return;

    const nextStatus = listing.status === "active" ? "paused" : "active";
    setBusyId(slug);
    setNotice(null);

    const { error } = await supabase
      .from("jet_skis")
      .update({ status: nextStatus })
      .eq("slug", slug)
      .eq("owner_id", data.profile.id);

    setBusyId(null);

    if (error) {
      setNotice("Impossible de changer le statut de cette annonce.");
      return;
    }

    setOwnerListings((current) =>
      current.map((item) => (item.slug === slug ? { ...item, status: nextStatus } : item)),
    );
  }

  function updatePriceDraft(slug: string, pricePerDay: number) {
    setOwnerListings((current) =>
      current.map((listing) => (listing.slug === slug ? { ...listing, pricePerDay } : listing)),
    );
  }

  async function finishEditing(listing: OwnerListingDashboard) {
    if (editingSlug !== listing.slug) {
      setEditingSlug(listing.slug);
      return;
    }

    setBusyId(listing.slug);
    setNotice(null);

    const { error } = await supabase
      .from("jet_skis")
      .update({ price_per_day: listing.pricePerDay })
      .eq("slug", listing.slug)
      .eq("owner_id", data.profile.id);

    setBusyId(null);

    if (error) {
      setNotice("Impossible d'enregistrer le prix pour le moment.");
      return;
    }

    setEditingSlug(null);
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold text-cyan-700">Espace propriétaire</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Gérez vos demandes et annonces.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Données réelles de votre compte connecté : demandes reçues, annonces publiées et suivi propriétaire.
            </p>
            {notice ? (
              <p className="mt-4 rounded-lg bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-900">
                {notice}
              </p>
            ) : null}
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
            <Metric label="Demandes à confirmer" value={`${pendingLeads}`} trend="Temps réel" />
            <Metric label="Demandes acceptées" value={`${acceptedLeads}`} trend="Compte connecté" />
            <Metric label="Annonces actives" value={`${activeListings}`} trend={`${ownerListings.length} total`} />
            <Metric label="Potentiel estimé" value={formatCurrency(estimatedPipeline)} trend="Sans paiement" />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Demandes clients</h2>
                <p className="mt-1 text-sm text-slate-500">Acceptez, refusez ou contactez à partir des demandes réelles.</p>
              </div>
              <Send className="text-cyan-700" size={26} />
            </div>
            <div className="mt-4 grid gap-3">
              {leads.length ? (
                leads.map((lead) => (
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
                          {lead.statusLabel}
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
                    {lead.status === "pending" ? (
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          disabled={busyId === lead.id}
                          onClick={() => updateLead(lead.id, "accepted")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white disabled:opacity-50"
                        >
                          <Check size={16} />
                          Accepter
                        </button>
                        <button
                          type="button"
                          disabled={busyId === lead.id}
                          onClick={() => updateLead(lead.id, "declined")}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700 disabled:opacity-50"
                        >
                          <X size={16} />
                          Refuser
                        </button>
                      </div>
                    ) : null}
                  </article>
                ))
              ) : (
                <EmptyState
                  title="Aucune demande réelle"
                  copy="Les demandes envoyées sur vos annonces apparaîtront ici."
                />
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Mes annonces</h2>
            <div className="mt-4 grid gap-4">
              {ownerListings.length ? (
                ownerListings.map((listing) => {
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
                                listing.status === "active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600",
                              )}
                            >
                              {listing.status === "active" ? "Active" : "En pause"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{listing.location} · Weekend {formatCurrency(listing.weekendPrice)}</p>
                          {editing ? (
                            <label className="mt-3 grid max-w-xs gap-2 text-sm font-bold text-slate-700">
                              Prix par jour
                              <input
                                type="number"
                                min={0}
                                value={listing.pricePerDay}
                                onChange={(event) => updatePriceDraft(listing.slug, Number(event.target.value))}
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
                            disabled={busyId === listing.slug}
                            onClick={() => finishEditing(listing)}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 disabled:opacity-50"
                          >
                            <Edit3 size={16} />
                            {editing ? "Enregistrer" : "Modifier"}
                          </button>
                          <Link
                            href={`/jet-skis/${listing.slug}`}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700"
                          >
                            <Eye size={16} /> Voir
                          </Link>
                          <button
                            type="button"
                            disabled={busyId === listing.slug}
                            onClick={() => toggleListing(listing.slug)}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700 disabled:opacity-50"
                          >
                            {listing.status === "active" ? <PauseCircle size={16} /> : <Power size={16} />}
                            {listing.status === "active" ? "Pause" : "Réactiver"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <EmptyState
                  title="Aucune annonce réelle"
                  copy="Ajoutez votre premier jet-ski pour commencer à recevoir des demandes."
                />
              )}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Calendrier réel</h2>
            <div className="mt-4 grid gap-3">
              {leads.length ? (
                leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-950">{lead.dateRange}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">{lead.listingName}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="Aucune date" copy="Les dates demandées par vos clients apparaîtront ici." compact />
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-950">Demandes reçues</h2>
              <BarChart3 className="text-cyan-700" size={22} />
            </div>
            {hasDemandBars ? (
              <div className="mt-5 flex h-44 items-end gap-2 rounded-lg bg-slate-50 p-3">
                {data.demandBars.map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#073b5d] to-cyan-400"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Aucune demande" copy="Le graphique se remplira avec les vraies demandes." compact />
            )}
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Performance</h2>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-4">
              <Star className="text-amber-600" size={24} fill="currentColor" />
              <div>
                <p className="text-2xl font-bold text-slate-950">{averageRating.toFixed(2)}</p>
                <p className="text-sm text-slate-600">Note moyenne de vos annonces</p>
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

function EmptyState({ title, copy, compact }: { title: string; copy: string; compact?: boolean }) {
  return (
    <div className={cn("rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center", compact ? "p-4" : "p-8")}>
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{copy}</p>
    </div>
  );
}
