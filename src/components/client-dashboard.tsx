"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CalendarDays,
  Heart,
  MessageCircle,
  Pencil,
  Save,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import type {
  ClientDashboardData,
  ClientRequest,
  DashboardProfile,
  FavoriteListing,
} from "@/lib/dashboard-data";
import { formatCurrency } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { RentalRequestStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<RentalRequestStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-50 text-rose-700",
  declined: "bg-rose-50 text-rose-700",
};

type DashboardTab = "demandes" | "favoris" | "messages" | "profil";

type ProfileDraft = Pick<DashboardProfile, "name" | "phone" | "boatingCard" | "preference">;

export function ClientDashboard({ data }: { data: ClientDashboardData }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("demandes");
  const [requests, setRequests] = useState<ClientRequest[]>(data.requests);
  const [favorites, setFavorites] = useState<FavoriteListing[]>(data.favorites);
  const [profile, setProfile] = useState(data.profile);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    name: data.profile.name,
    phone: data.profile.phone,
    boatingCard: data.profile.boatingCard,
    preference: data.profile.preference,
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const upcomingCount = requests.filter((request) => request.status === "accepted").length;
  const completedFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.boatingCard,
    profile.preference,
  ].filter(Boolean).length;
  const profileCompletion = Math.round((completedFields / 5) * 100);

  async function cancelRequest(id: string) {
    setBusyId(id);
    setNotice(null);

    const { error } = await supabase
      .from("rental_requests")
      .update({ status: "cancelled" })
      .eq("id", id)
      .eq("client_id", profile.id);

    setBusyId(null);

    if (error) {
      setNotice("Impossible d'annuler cette demande pour le moment.");
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status: "cancelled", statusLabel: "Annulée" }
          : request,
      ),
    );
  }

  async function removeFavorite(slug: string) {
    setBusyId(slug);
    setNotice(null);

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", profile.id)
      .eq("listing_slug", slug);

    setBusyId(null);

    if (error) {
      setNotice("Impossible de retirer ce favori pour le moment.");
      return;
    }

    setFavorites((current) => current.filter((listing) => listing.slug !== slug));
  }

  async function saveProfile() {
    setBusyId("profile");
    setNotice(null);

    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      email: profile.email,
      full_name: profileDraft.name,
      phone: profileDraft.phone || null,
      role: profile.role,
      boating_card: profileDraft.boatingCard || null,
      preference: profileDraft.preference || null,
    });

    setBusyId(null);

    if (error) {
      setNotice("Impossible d'enregistrer le profil pour le moment.");
      return;
    }

    setProfile((current) => ({ ...current, ...profileDraft }));
    setNotice("Profil enregistré.");
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Espace client</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Bonjour {profile.name}, vos demandes sont suivies ici.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Données liées à votre compte connecté : demandes, favoris, messages et profil.
          </p>
          {notice ? (
            <p className="mt-4 rounded-lg bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-900">
              {notice}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <main className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={<CalendarDays size={22} />} label="Demandes acceptées" value={`${upcomingCount}`} />
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
              {requests.length ? (
                <div className="grid gap-3">
                  {requests.map((request) => (
                    <article key={request.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-cyan-700">{request.id}</p>
                          <h2 className="mt-1 text-lg font-bold text-slate-950">{request.listingName}</h2>
                          <p className="mt-1 text-sm text-slate-600">
                            {request.dateRange} · {request.location} · {request.modeLabel}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[request.status])}>
                            {request.statusLabel}
                          </span>
                          <span className="text-sm font-bold text-slate-950">{formatCurrency(request.estimateTotal)}</span>
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
                        {request.status === "pending" ? (
                          <button
                            type="button"
                            disabled={busyId === request.id}
                            onClick={() => cancelRequest(request.id)}
                            className="inline-flex h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                          >
                            <XCircle size={16} />
                            Annuler la demande
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Aucune demande réelle"
                  copy="Vos futures demandes envoyées aux propriétaires apparaîtront ici."
                />
              )}
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
                          disabled={busyId === listing.slug}
                          onClick={() => removeFavorite(listing.slug)}
                          className="grid size-10 place-items-center rounded-full bg-rose-50 text-rose-700 disabled:opacity-50"
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
                <EmptyState title="Aucun favori réel" copy="Ajoutez des jet-skis depuis Explorer pour les retrouver ici." />
              )}
            </Panel>
          ) : null}

          {activeTab === "messages" ? (
            <Panel title="Messages propriétaires">
              {data.conversations.length ? (
                <div className="grid gap-3">
                  {data.conversations.map((conversation) => (
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
              ) : (
                <EmptyState title="Aucun message réel" copy="Les conversations créées depuis vos demandes apparaîtront ici." />
              )}
            </Panel>
          ) : null}

          {activeTab === "profil" ? (
            <Panel title="Profil et préférences">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileInput label="Nom complet" value={profileDraft.name} onChange={(name) => setProfileDraft({ ...profileDraft, name })} />
                <ProfileInput label="Téléphone" value={profileDraft.phone} onChange={(phone) => setProfileDraft({ ...profileDraft, phone })} />
                <ProfileInput label="Courriel" value={profile.email} disabled />
                <ProfileInput label="Carte conducteur" value={profileDraft.boatingCard} onChange={(boatingCard) => setProfileDraft({ ...profileDraft, boatingCard })} />
                <ProfileInput label="Préférence" value={profileDraft.preference} onChange={(preference) => setProfileDraft({ ...profileDraft, preference })} />
              </div>
              <button
                type="button"
                disabled={busyId === "profile"}
                onClick={saveProfile}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                <Save size={17} />
                Enregistrer
              </button>
            </Panel>
          ) : null}
        </main>

        <aside className="space-y-6">
          <Panel title="Profil">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-[#073b5d] font-bold text-white">
                {profile.initials}
              </span>
              <div>
                <p className="font-bold text-slate-950">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.email}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} /> Profil complet à {profileCompletion}%
              </span>
              <span className="inline-flex items-center gap-2">
                <Pencil size={16} /> Préférence : {profile.preference || "Non renseignée"}
              </span>
            </div>
          </Panel>

          <Panel title="Prochaine action">
            <div className="rounded-lg bg-[#073b5d] p-5 text-white">
              <p className="text-sm font-bold text-cyan-100">Données réelles</p>
              <p className="mt-3 text-2xl font-bold">Envoyer une demande</p>
              <p className="mt-2 text-sm text-cyan-50">
                Votre espace se remplit uniquement quand vous créez des favoris, demandes ou messages.
              </p>
              <Link
                href="/explorer"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-[#073b5d]"
              >
                Explorer les annonces
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
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-500"
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
