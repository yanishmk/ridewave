"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, CreditCard, MapPin, ShieldCheck, Truck } from "lucide-react";
import { formatCurrency, type JetSkiListing } from "@/lib/data";

export function BookingPanel({ listing }: { listing: JetSkiListing }) {
  const [days, setDays] = useState(2);
  const [mode, setMode] = useState<"pickup" | "delivery">("delivery");
  const rental = useMemo(() => listing.pricePerDay * days, [days, listing.pricePerDay]);
  const delivery = mode === "delivery" && listing.deliveryAvailable ? listing.deliveryFee : 0;
  const total = rental + delivery + listing.serviceFee + listing.deposit;

  return (
    <aside className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-slate-950">
            {formatCurrency(listing.pricePerDay)}
            <span className="text-sm font-medium text-slate-500"> / jour</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">Dépôt remboursable inclus au total.</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
          {listing.cancellation}
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={16} /> Date de départ
          </span>
          <input type="date" className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none focus:border-cyan-500" />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={16} /> Date de retour
          </span>
          <input type="date" className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none focus:border-cyan-500" />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Durée facturée
          <input
            type="number"
            min="1"
            max="7"
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none focus:border-cyan-500"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center gap-2">
            <Clock size={16} /> Heure de récupération
          </span>
          <input type="time" defaultValue="09:30" className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none focus:border-cyan-500" />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("pickup")}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
              mode === "pickup"
                ? "border-[#073b5d] bg-[#073b5d] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
            }`}
          >
            <MapPin size={16} />
            Sur place
          </button>
          <button
            type="button"
            onClick={() => setMode("delivery")}
            disabled={!listing.deliveryAvailable}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${
              mode === "delivery"
                ? "border-[#073b5d] bg-[#073b5d] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300"
            }`}
          >
            <Truck size={16} />
            Livraison
          </button>
        </div>

        {mode === "delivery" ? (
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Adresse de livraison
            <input
              type="text"
              placeholder="Quai, marina ou adresse"
              className="h-11 rounded-lg border border-slate-200 px-3 text-slate-900 outline-none focus:border-cyan-500"
            />
          </label>
        ) : null}
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <Line label={`Location x ${days} jour${days > 1 ? "s" : ""}`} value={formatCurrency(rental)} />
        <Line label="Frais de livraison" value={delivery ? formatCurrency(delivery) : "0 $"} />
        <Line label="Frais de service" value={formatCurrency(listing.serviceFee)} />
        <Line label="Dépôt de sécurité" value={formatCurrency(listing.deposit)} />
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-950">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Link
        href={`/reservation?jet=${listing.slug}`}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
      >
        <CreditCard size={18} />
        Réserver maintenant
      </Link>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
        <ShieldCheck size={15} className="text-emerald-600" />
        Paiement sécurisé, identité vérifiée plus tard.
      </p>
    </aside>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-slate-600">
      <span>{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
