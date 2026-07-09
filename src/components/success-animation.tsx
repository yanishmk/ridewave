"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, MessageCircle, ReceiptText } from "lucide-react";
import { formatCurrency, type JetSkiListing } from "@/lib/data";

export function SuccessAnimation({ listing }: { listing: JetSkiListing }) {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-xl shadow-cyan-900/10 sm:p-10">
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="mx-auto grid size-24 place-items-center rounded-full bg-emerald-100 text-emerald-700"
      >
        <motion.span
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Check size={46} strokeWidth={3} />
        </motion.span>
      </motion.div>

      <p className="mt-6 text-sm font-bold text-cyan-700">Demande RW-7429</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Votre demande est envoyée.</h1>
      <p className="mx-auto mt-3 max-w-xl text-slate-600">
        {listing.host.name} a reçu le récapitulatif et vous contactera pour confirmer la
        disponibilité, les consignes et le point de remise.
      </p>

      <div className="mt-8 grid gap-3 rounded-lg bg-slate-50 p-4 text-left sm:grid-cols-2">
        <Info label="Jet-ski" value={listing.name} />
        <Info label="Propriétaire" value={listing.host.name} />
        <Info label="Lieu" value={listing.location} />
        <Info label="Estimation" value={formatCurrency(listing.pricePerDay + listing.deliveryFee + listing.deposit)} />
        <Info label="Contact" value={listing.host.phone} />
        <Info label="Mode" value={listing.deliveryAvailable ? "Livraison au quai" : "Récupération sur place"} />
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
        >
          <ReceiptText size={18} />
          Voir mes demandes
        </Link>
        <Link
          href="/messages"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
        >
          <MessageCircle size={18} />
          Message propriétaire
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}
