import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarClock,
  Gauge,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { BookingPanel } from "@/components/booking-panel";
import { InteractiveMap } from "@/components/interactive-map";
import { ListingCard } from "@/components/listing-card";
import { formatCurrency, getListing, listings } from "@/lib/data";

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListing(slug);

  return {
    title: listing ? `${listing.name} | RideWave` : "Jet-ski | RideWave",
    description: listing?.description,
  };
}

export default async function JetSkiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = getListing(slug);

  if (!listing) notFound();

  const similar = listings.filter((item) => item.slug !== listing.slug).slice(0, 3);

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-cyan-700">{listing.location}</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">{listing.name}</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-amber-700 shadow-sm sm:flex">
            <Star size={17} fill="currentColor" />
            {listing.rating} · {listing.reviews} avis
          </div>
        </div>

        <div className="grid min-h-[460px] gap-3 overflow-hidden rounded-lg lg:grid-cols-[1.3fr_.7fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-lg">
            <Image src={listing.images[0]} alt={listing.name} fill priority sizes="70vw" className="object-cover" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {listing.images.slice(1, 3).map((image, index) => (
              <div key={image} className="relative min-h-[220px] overflow-hidden rounded-lg">
                <Image src={image} alt={`${listing.name} photo ${index + 2}`} fill sizes="30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <main className="min-w-0 space-y-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-950">
                  {formatCurrency(listing.pricePerDay)}
                  <span className="text-sm font-medium text-slate-500"> / jour</span>
                </p>
                <p className="mt-2 text-slate-600">{listing.description}</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <span className="grid size-12 place-items-center rounded-full bg-[#073b5d] text-sm font-bold text-white">
                  {listing.host.avatar}
                </span>
                <div>
                  <p className="font-bold text-slate-950">{listing.host.name}</p>
                  <p className="text-sm text-slate-500">Répond en {listing.host.responseTime}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info icon={<BadgeCheck size={20} />} label="Marque" value={listing.brand} />
              <Info icon={<Gauge size={20} />} label="Puissance" value={`${listing.horsepower} hp`} />
              <Info icon={<UsersRound size={20} />} label="Passagers" value={`${listing.passengers}`} />
              <Info icon={<CalendarClock size={20} />} label="Année" value={`${listing.year}`} />
            </div>
          </div>

          <Section title="Équipement inclus">
            <div className="grid gap-3 sm:grid-cols-2">
              {listing.equipment.map((item) => (
                <span key={item} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Règles du propriétaire">
            <ul className="grid gap-3">
              {listing.rules.map((rule) => (
                <li key={rule} className="flex gap-3 rounded-lg bg-white p-4 text-sm text-slate-700 shadow-sm">
                  <ShieldCheck className="shrink-0 text-emerald-600" size={19} />
                  {rule}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Zone de navigation recommandée">
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 text-cyan-950">
              <p className="font-semibold">{listing.navigationZone}</p>
            </div>
          </Section>

          <Section title="Localisation approximative">
            <InteractiveMap listings={[listing]} />
          </Section>

          <Section title="Avis clients">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "Remise simple, équipement impeccable et propriétaire très clair.",
                "La livraison au quai a sauvé notre matinée. Très premium.",
                "Jet-ski stable et parfait pour une première sortie à deux.",
              ].map((review, index) => (
                <article key={review} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{review}</p>
                  <p className="mt-4 text-sm font-bold text-slate-950">Client vérifié #{index + 1}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section title="Jet-skis similaires">
            <div className="grid gap-5 md:grid-cols-3">
              {similar.map((item) => (
                <ListingCard key={item.slug} listing={item} />
              ))}
            </div>
          </Section>
        </main>

        <BookingPanel listing={listing} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 shadow-2xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-950">{formatCurrency(listing.pricePerDay)} / jour</p>
            <p className="text-xs text-slate-500">{listing.location}</p>
          </div>
          <Link
            href={`/reservation?jet=${listing.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="text-cyan-700">{icon}</div>
      <p className="mt-3 text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
