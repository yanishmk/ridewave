import Link from "next/link";
import {
  CalendarDays,
  Check,
  CircleDollarSign,
  MessageCircle,
  PauseCircle,
  Pencil,
  Plus,
  Star,
  X,
} from "lucide-react";
import { bookings, formatCurrency, listings, ownerStats, revenueBars } from "@/lib/data";

export default function OwnerDashboardPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold text-cyan-700">Espace propriétaire</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">Pilotez vos locations RideWave.</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Prix, disponibilités, réservations, messages, revenus et mise en pause des annonces.
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
            {ownerStats.map((stat) => (
              <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {stat.trend}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Graphique de revenus</h2>
                <p className="mt-1 text-sm text-slate-500">12 dernières semaines</p>
              </div>
              <CircleDollarSign className="text-cyan-700" size={26} />
            </div>
            <div className="mt-6 flex h-56 items-end gap-3 rounded-lg bg-slate-50 p-4">
              {revenueBars.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#073b5d] to-cyan-400"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs font-bold text-slate-500">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Réservations à confirmer</h2>
            <div className="mt-4 grid gap-3">
              {bookings.slice(0, 2).map((booking) => (
                <article key={booking.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-cyan-700">{booking.id}</p>
                      <h3 className="mt-1 font-bold text-slate-950">{booking.listingName}</h3>
                      <p className="mt-1 text-sm text-slate-600">{booking.dateRange} · {formatCurrency(booking.total)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white">
                        <Check size={16} />
                        Accepter
                      </button>
                      <button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-bold text-rose-700">
                        <X size={16} />
                        Refuser
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Mes annonces</h2>
            <div className="mt-4 grid gap-4">
              {listings.slice(0, 4).map((listing) => (
                <article key={listing.slug} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold text-slate-950">{listing.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {listing.location} · {formatCurrency(listing.pricePerDay)} / jour · Weekend {formatCurrency(listing.weekendPrice)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700">
                        <Pencil size={16} /> Modifier
                      </button>
                      <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700">
                        <CalendarDays size={16} /> Calendrier
                      </button>
                      <button type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-700">
                        <PauseCircle size={16} /> Pause
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Calendrier des locations</h2>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, index) => (
                <span
                  key={index}
                  className={`grid aspect-square place-items-center rounded-lg text-sm font-bold ${
                    index % 6 === 0
                      ? "bg-cyan-600 text-white"
                      : index % 9 === 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-50 text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Messages clients</h2>
            <div className="mt-4 space-y-3">
              {["Livraison Britannia", "Question dépôt", "Horaire Aylmer"].map((message) => (
                <Link key={message} href="/messages" className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <MessageCircle className="text-cyan-700" size={18} />
                  <span className="text-sm font-bold text-slate-700">{message}</span>
                </Link>
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
