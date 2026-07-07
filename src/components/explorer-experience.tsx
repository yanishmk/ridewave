"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LayoutList, Map, Search, SlidersHorizontal, Star, Truck, Waves } from "lucide-react";
import { InteractiveMap } from "@/components/interactive-map";
import { ListingCard } from "@/components/listing-card";
import { type JetSkiListing } from "@/lib/data";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "map";

export function ExplorerExperience({ listings }: { listings: JetSkiListing[] }) {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [maxPrice, setMaxPrice] = useState(380);
  const [type, setType] = useState("Tous");
  const [minPassengers, setMinPassengers] = useState(1);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [flexibleOnly, setFlexibleOnly] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      if (listing.pricePerDay > maxPrice) return false;
      if (type !== "Tous" && listing.type !== type) return false;
      if (listing.passengers < minPassengers) return false;
      if (deliveryOnly && !listing.deliveryAvailable) return false;
      if (flexibleOnly && listing.cancellation !== "Flexible") return false;
      if (availableToday && listing.distanceKm > 10) return false;
      return true;
    });
  }, [availableToday, deliveryOnly, flexibleOnly, listings, maxPrice, minPassengers, type]);

  return (
    <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Filtres</h2>
            <p className="mt-1 text-sm text-slate-500">Affinez les offres disponibles.</p>
          </div>
          <SlidersHorizontal className="text-cyan-600" size={22} />
        </div>

        <div className="mt-6 space-y-6">
          <label className="grid gap-3">
            <span className="flex items-center justify-between text-sm font-bold text-slate-800">
              Prix par jour
              <span className="text-cyan-700">{maxPrice} $</span>
            </span>
            <input
              type="range"
              min="200"
              max="420"
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="accent-cyan-600"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Type de jet-ski
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-cyan-500"
            >
              {["Tous", "Sport", "Familial", "Premium", "Débutant"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Nombre de places
            <input
              type="number"
              min="1"
              max="3"
              value={minPassengers}
              onChange={(event) => setMinPassengers(Number(event.target.value))}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-cyan-500"
            />
          </label>

          <div className="grid gap-3">
            <Toggle
              checked={deliveryOnly}
              onChange={setDeliveryOnly}
              icon={<Truck size={17} />}
              label="Livraison disponible"
            />
            <Toggle
              checked={availableToday}
              onChange={setAvailableToday}
              icon={<Waves size={17} />}
              label="Disponible aujourd'hui"
            />
            <Toggle
              checked={flexibleOnly}
              onChange={setFlexibleOnly}
              icon={<Star size={17} />}
              label="Annulation flexible"
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            Distance max : 20 km · Évaluation minimum : 4.7 · Ottawa, Gatineau, Aylmer et Lac Leamy.
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-cyan-700">
              <Search size={17} />
              {filtered.length} jet-skis trouvés
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">Ottawa - Gatineau</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition",
                viewMode === "list" ? "bg-[#073b5d] text-white" : "bg-slate-100 text-slate-700",
              )}
            >
              <LayoutList size={17} />
              Liste
            </button>
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition",
                viewMode === "map" ? "bg-[#073b5d] text-white" : "bg-slate-100 text-slate-700",
              )}
            >
              <Map size={17} />
              Carte
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-[220px_1fr]">
                <div className="h-56 animate-pulse bg-slate-200 sm:h-auto" />
                <div className="space-y-4 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-10 w-36 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "map" ? (
          <InteractiveMap listings={filtered.length ? filtered : listings} />
        ) : (
          <div className="grid gap-4">
            {filtered.length ? (
              filtered.map((listing) => <ListingCard key={listing.slug} listing={listing} compact />)
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-xl font-bold text-slate-950">Aucune annonce ne correspond.</h2>
                <p className="mt-2 text-slate-600">Élargissez le prix, la distance ou le type de jet-ski.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  icon,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
      <span className="inline-flex items-center gap-2">
        {icon}
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-cyan-600"
      />
    </label>
  );
}
