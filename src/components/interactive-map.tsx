"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Star } from "lucide-react";
import { formatCurrency, type JetSkiListing } from "@/lib/data";

export function InteractiveMap({ listings }: { listings: JetSkiListing[] }) {
  const [selectedSlug, setSelectedSlug] = useState(listings[0]?.slug);
  const selected = useMemo(
    () => listings.find((listing) => listing.slug === selectedSlug) ?? listings[0],
    [listings, selectedSlug],
  );

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-200 bg-[#d8f5f4] shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,.9),transparent_19%),linear-gradient(135deg,rgba(7,59,93,.18),transparent_34%),linear-gradient(45deg,rgba(20,184,166,.2),transparent_42%)]" />
      <div className="absolute left-[7%] top-[14%] h-[72%] w-[42%] rounded-[45%] bg-emerald-100/80 blur-[1px]" />
      <div className="absolute right-[4%] top-[7%] h-[84%] w-[56%] rounded-[48%] bg-cyan-100/75 blur-[1px]" />
      <div className="absolute left-[24%] top-[12%] h-[78%] w-[30%] -rotate-12 rounded-full border-[24px] border-white/45" />
      <div className="absolute right-[16%] top-[18%] h-[62%] w-[34%] rotate-12 rounded-full border-[18px] border-white/50" />

      <div className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
          <Navigation size={17} className="text-cyan-600" />
          Ottawa - Gatineau
        </div>
        <p className="mt-1 text-xs text-slate-500">Carte de disponibilité simulée</p>
      </div>

      {listings.map((listing) => {
        const active = selected?.slug === listing.slug;

        return (
          <button
            type="button"
            key={listing.slug}
            onClick={() => setSelectedSlug(listing.slug)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${listing.coordinates.x}%`, top: `${listing.coordinates.y}%` }}
            aria-label={`Sélectionner ${listing.name}`}
          >
            <motion.span
              animate={{ scale: active ? 1.15 : 1 }}
              className="relative grid size-11 place-items-center rounded-full bg-[#073b5d] text-white shadow-lg shadow-slate-900/20 ring-4 ring-white/80"
            >
              <MapPin size={20} fill="currentColor" />
              {active ? (
                <motion.span
                  layoutId="map-pulse"
                  className="absolute inset-0 -z-10 rounded-full bg-cyan-400/40"
                  animate={{ scale: [1, 1.75, 1], opacity: [0.75, 0, 0.75] }}
                  transition={{ duration: 1.7, repeat: Infinity }}
                />
              ) : null}
            </motion.span>
          </button>
        );
      })}

      {selected ? (
        <motion.div
          key={selected.slug}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-4 bottom-4 z-30 rounded-lg bg-white p-4 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-cyan-700">{selected.location}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-950">{selected.name}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {formatCurrency(selected.pricePerDay)} / jour · {selected.passengers} passagers
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
              <Star size={15} fill="currentColor" />
              {selected.rating}
            </span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
