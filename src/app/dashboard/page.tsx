import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Heart,
  MessageCircle,
  Star,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { ListingCard } from "@/components/listing-card";
import { bookings, conversations, formatCurrency, listings, type BookingStatus } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  "En attente": "bg-amber-50 text-amber-700",
  Confirmée: "bg-emerald-50 text-emerald-700",
  Terminée: "bg-slate-100 text-slate-700",
  Annulée: "bg-rose-50 text-rose-700",
  "À venir aujourd'hui": "bg-cyan-50 text-cyan-700",
};

const dashboardBookings = [
  ...bookings,
  {
    id: "RW-7440",
    listingSlug: "sea-doo-wake-pro-ottawa-river",
    listingName: "Sea-Doo Wake Pro 230",
    dateRange: "26 juillet 2026",
    status: "En attente" as BookingStatus,
    location: "Ottawa River",
    total: 1373,
    mode: "Livraison" as const,
  },
  {
    id: "RW-6118",
    listingSlug: "kawasaki-ultra-chelsea",
    listingName: "Kawasaki Ultra LX Chelsea",
    dateRange: "12 mai 2026",
    status: "Annulée" as BookingStatus,
    location: "Chelsea",
    total: 0,
    mode: "Récupération" as const,
  },
];

export default function DashboardPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Espace client</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Bonjour Alex, votre prochaine sortie vous attend.</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <main className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={<CalendarDays size={22} />} label="Prochaines réservations" value="3" />
            <Metric icon={<Heart size={22} />} label="Favoris" value="8" />
            <Metric icon={<MessageCircle size={22} />} label="Messages non lus" value="3" />
          </div>

          <Panel title="Réservations">
            <div className="grid gap-3">
              {dashboardBookings.map((booking) => (
                <article key={booking.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-cyan-700">{booking.id}</p>
                      <h2 className="mt-1 text-lg font-bold text-slate-950">{booking.listingName}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {booking.dateRange} · {booking.location} · {booking.mode}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusStyles[booking.status])}>
                        {booking.status}
                      </span>
                      <span className="text-sm font-bold text-slate-950">{formatCurrency(booking.total)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Jet-skis enregistrés">
            <div className="grid gap-5 md:grid-cols-2">
              {listings.slice(0, 2).map((listing) => (
                <ListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
          </Panel>

          <Panel title="Avis laissés">
            <div className="grid gap-4 sm:grid-cols-2">
              {["Maya a été impeccable pour la livraison.", "Très bon briefing avant le départ."].map((review) => (
                <article key={review} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{review}</p>
                </article>
              ))}
            </div>
          </Panel>
        </main>

        <aside className="space-y-6">
          <Panel title="Profil">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-[#073b5d] font-bold text-white">AM</span>
              <div>
                <p className="font-bold text-slate-950">Alex Martin</p>
                <p className="text-sm text-slate-500">Identité prête à vérifier</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} /> Profil complet à 86%
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard size={16} /> Visa se terminant par 4242
              </span>
            </div>
          </Panel>

          <Panel title="Messages propriétaires">
            <div className="grid gap-3">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href="/messages"
                  className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-200"
                >
                  <p className="font-bold text-slate-950">{conversation.host}</p>
                  <p className="mt-1 text-sm text-slate-600">{conversation.listing}</p>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Moyens de paiement">
            <div className="rounded-lg bg-slate-950 p-5 text-white">
              <p className="text-sm text-cyan-100">RideWave Secure</p>
              <p className="mt-8 font-mono text-lg">•••• •••• •••• 4242</p>
              <p className="mt-2 text-sm text-slate-300">Stripe prêt à brancher</p>
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
