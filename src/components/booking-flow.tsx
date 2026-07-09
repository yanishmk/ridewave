"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Truck,
  UserRound,
} from "lucide-react";
import { formatCurrency, type JetSkiListing } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Dates", icon: CalendarDays },
  { title: "Mode", icon: Truck },
  { title: "Client", icon: UserRound },
  { title: "Identité", icon: ShieldCheck },
  { title: "Demande", icon: CheckCircle2 },
];

export function BookingFlow({ listing }: { listing: JetSkiListing }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"pickup" | "delivery">("delivery");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = useMemo(() => {
    const delivery = mode === "delivery" && listing.deliveryAvailable ? listing.deliveryFee : 0;
    return listing.pricePerDay + delivery + listing.deposit;
  }, [listing, mode]);

  async function submitRequest() {
    setError(null);
    setIsSubmitting(true);

    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setIsSubmitting(false);
      setError("Supabase doit être configuré avant d'envoyer une vraie demande.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSubmitting(false);
      router.push(`/connexion?redirectTo=${encodeURIComponent(`/reservation?jet=${listing.slug}`)}`);
      return;
    }

    const clientName =
      typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()
        ? user.user_metadata.full_name.trim()
        : user.email?.split("@")[0] ?? "Client RideWave";

    const { data: request, error: requestError } = await supabase
      .from("rental_requests")
      .insert({
        client_id: user.id,
        owner_id: listing.ownerId ?? null,
        listing_slug: listing.slug,
        listing_name: listing.name,
        client_name: clientName,
        start_date: startDate || null,
        end_date: endDate || null,
        status: "pending",
        location: listing.location,
        estimate_total: total,
        mode,
        note: null,
      })
      .select("id")
      .single();

    if (requestError) {
      setIsSubmitting(false);
      setError("Impossible d'enregistrer la demande. Vérifiez les tables Supabase.");
      return;
    }

    await supabase.from("conversations").insert({
      client_id: user.id,
      owner_id: listing.ownerId ?? null,
      listing_slug: listing.slug,
      listing_name: listing.name,
      client_name: clientName,
      owner_name: listing.host.name,
      status: "request",
      unread_for_client: 0,
      unread_for_owner: 1,
    });

    router.push(`/reservation/succes?jet=${listing.slug}&request=${request.id}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-7">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index <= step;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setStep(index)}
                  className="grid min-w-0 gap-2"
                  aria-label={`Étape ${item.title}`}
                >
                  <span
                    className={cn(
                      "mx-auto grid size-10 place-items-center rounded-full border text-slate-500 transition",
                      active
                        ? "border-[#073b5d] bg-[#073b5d] text-white"
                        : "border-slate-200 bg-slate-50",
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="hidden text-xs font-bold text-slate-600 sm:block">{item.title}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {step === 0 ? (
          <DatesStep
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        ) : null}
        {step === 1 ? <ModeStep mode={mode} setMode={setMode} deliveryAvailable={listing.deliveryAvailable} /> : null}
        {step === 2 ? <ClientStep /> : null}
        {step === 3 ? <IdentityStep /> : null}
        {step === 4 ? <ReadyStep listing={listing} /> : null}
        {error ? (
          <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="h-11 rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            disabled={step === 0}
          >
            Retour
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
            >
              Continuer
              <ChevronRight size={17} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={submitRequest}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c] disabled:translate-y-0 disabled:opacity-50"
            >
              {isSubmitting ? "Envoi..." : "Envoyer la demande"}
              <CheckCircle2 size={17} />
            </button>
          )}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <p className="text-sm font-bold text-cyan-700">Récapitulatif</p>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{listing.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{listing.location} · {listing.host.name}</p>
        <div className="mt-5 space-y-3 text-sm">
          <Line label="Location" value={formatCurrency(listing.pricePerDay)} />
          <Line label="Livraison" value={mode === "delivery" ? formatCurrency(listing.deliveryFee) : "0 $"} />
          <Line label="Dépôt à prévoir" value={formatCurrency(listing.deposit)} />
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-950">
            <span>Estimation</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="rounded-lg bg-cyan-50 p-3 text-xs font-semibold text-cyan-900">
            Aucun paiement en ligne au lancement. Le propriétaire confirme la disponibilité et
            les modalités directement avec vous.
          </p>
        </div>
      </aside>
    </div>
  );
}

function DatesStep({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Choisissez vos dates et horaires</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Input label="Date de départ" type="date" value={startDate} onChange={setStartDate} />
        <Input label="Date de retour" type="date" value={endDate} onChange={setEndDate} />
        <Input label="Heure de récupération" type="time" defaultValue="09:30" />
      </div>
    </div>
  );
}

function ModeStep({
  mode,
  setMode,
  deliveryAvailable,
}: {
  mode: "pickup" | "delivery";
  setMode: (mode: "pickup" | "delivery") => void;
  deliveryAvailable: boolean;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Récupération ou livraison</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("pickup")}
          className={cn(
            "rounded-lg border p-5 text-left transition",
            mode === "pickup" ? "border-[#073b5d] bg-cyan-50" : "border-slate-200 bg-white",
          )}
        >
          <MapIcon />
          <h2 className="mt-4 text-lg font-bold text-slate-950">Récupération sur place</h2>
          <p className="mt-2 text-sm text-slate-600">Briefing au point de rencontre et départ encadré.</p>
        </button>
        <button
          type="button"
          onClick={() => setMode("delivery")}
          disabled={!deliveryAvailable}
          className={cn(
            "rounded-lg border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-50",
            mode === "delivery" ? "border-[#073b5d] bg-cyan-50" : "border-slate-200 bg-white",
          )}
        >
          <Truck className="text-cyan-600" size={24} />
          <h2 className="mt-4 text-lg font-bold text-slate-950">Livraison au quai</h2>
          <p className="mt-2 text-sm text-slate-600">Ajoutez l&apos;adresse, la marina ou le quai privé.</p>
        </button>
      </div>
      {mode === "delivery" ? (
        <div className="mt-4">
          <Input label="Adresse de livraison" type="text" placeholder="Ex. Quai 12, Parc Jacques-Cartier" />
        </div>
      ) : null}
    </div>
  );
}

function ClientStep() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Informations client</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Nom complet" type="text" placeholder="Alex Martin" />
        <Input label="Téléphone" type="tel" placeholder="+1 613 555 0101" />
        <Input label="Courriel" type="email" placeholder="alex@exemple.ca" />
        <Input label="Nombre de passagers" type="number" defaultValue="2" />
      </div>
    </div>
  );
}

function IdentityStep() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Vérification d&apos;identité</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input label="Type de permis" type="text" placeholder="Carte de conducteur d'embarcation" />
        <Input label="Numéro de document" type="text" placeholder="RW-2026-000" />
      </div>
      <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
        Vérification simulée : la vraie vérification d&apos;identité pourra être branchée ici plus tard.
      </div>
    </div>
  );
}

function ReadyStep({ listing }: { listing: JetSkiListing }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Envoyer votre demande</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        La demande sera envoyée à {listing.host.name}. Aucun paiement n&apos;est demandé maintenant :
        le propriétaire confirme la disponibilité, les consignes et la remise du jet-ski.
      </p>
      <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
        Objectif lancement : friction minimale, contact rapide, prix estimé clair et validation
        humaine avant toute étape de paiement future.
      </div>
    </div>
  );
}

function Input({
  label,
  type,
  placeholder,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
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

function MapIcon() {
  return <MapPin className="text-cyan-600" size={24} />;
}
