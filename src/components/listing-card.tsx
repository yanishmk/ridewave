import Image from "next/image";
import Link from "next/link";
import { Gauge, Heart, MapPin, Star, Truck, UsersRound } from "lucide-react";
import { formatCurrency, type JetSkiListing } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ListingCard({
  listing,
  compact = false,
}: {
  listing: JetSkiListing;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-900/10",
        compact && "grid sm:grid-cols-[220px_1fr]",
      )}
    >
      <div className={cn("relative min-h-56 overflow-hidden", compact && "sm:min-h-full")}>
        <Image
          src={listing.images[0]}
          alt={listing.name}
          fill
          sizes={compact ? "(max-width: 768px) 100vw, 220px" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[#073b5d] shadow-sm">
            {listing.type}
          </span>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/92 text-slate-700 shadow-sm transition hover:text-rose-500"
            aria-label={`Ajouter ${listing.name} aux favoris`}
          >
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">{listing.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              {listing.brand} {listing.model} · {listing.year}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
            <Star size={15} fill="currentColor" />
            {listing.rating}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <UsersRound size={16} />
            {listing.passengers} passagers
          </span>
          <span className="inline-flex items-center gap-2">
            <Gauge size={16} />
            {listing.horsepower} hp
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} />
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <Truck size={16} />
            {listing.deliveryAvailable ? "Livraison" : "Sur place"}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xl font-bold text-slate-950">
              {formatCurrency(listing.pricePerDay)}
              <span className="text-sm font-medium text-slate-500"> / jour</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{listing.distanceKm} km · {listing.reviews} avis</p>
          </div>
          <Link
            href={`/jet-skis/${listing.slug}`}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#073b5d] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
}
