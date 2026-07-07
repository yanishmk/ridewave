"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BadgeDollarSign,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MapPin,
  PackageCheck,
  ShipWheel,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const wizardSteps = [
  "Informations",
  "Photos",
  "Caractéristiques",
  "Prix",
  "Localisation",
  "Livraison",
  "Disponibilités",
  "Règles",
  "Publication",
];

export function ListingWizard() {
  const [step, setStep] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <p className="text-sm font-bold text-cyan-700">Nouvelle annonce</p>
        <h1 className="mt-1 text-xl font-bold text-slate-950">Publier un jet-ski</h1>
        <div className="mt-5 space-y-2">
          {wizardSteps.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition",
                index === step
                  ? "bg-[#073b5d] text-white"
                  : index < step
                    ? "bg-cyan-50 text-[#073b5d]"
                    : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="grid size-7 place-items-center rounded-full bg-white/20 text-xs">
                {index < step ? <CheckCircle2 size={15} /> : index + 1}
              </span>
              {item}
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${((step + 1) / wizardSteps.length) * 100}%` }}
          />
        </div>

        {step === 0 ? <GeneralStep /> : null}
        {step === 1 ? <PhotosStep /> : null}
        {step === 2 ? <SpecsStep /> : null}
        {step === 3 ? <PricingStep /> : null}
        {step === 4 ? <LocationStep /> : null}
        {step === 5 ? <DeliveryStep /> : null}
        {step === 6 ? <AvailabilityStep /> : null}
        {step === 7 ? <RulesStep /> : null}
        {step === 8 ? <PreviewStep /> : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="h-11 rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(wizardSteps.length - 1, value + 1))}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
          >
            {step === wizardSteps.length - 1 ? "Publier l'annonce" : "Continuer"}
            <ChevronRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

function GeneralStep() {
  return (
    <StepShell icon={<ShipWheel size={24} />} title="Informations générales">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Marque" placeholder="Sea-Doo" />
        <Input label="Modèle" placeholder="GTX 170" />
        <Input label="Année" type="number" placeholder="2024" />
        <Input label="Nombre de places" type="number" placeholder="3" />
      </div>
      <Textarea label="Description" placeholder="Décrivez l'expérience, le confort et les conditions idéales." />
    </StepShell>
  );
}

function PhotosStep() {
  return (
    <StepShell icon={<Camera size={24} />} title="Photos">
      <div className="rounded-lg border border-dashed border-cyan-300 bg-cyan-50 p-8 text-center">
        <Camera className="mx-auto text-cyan-700" size={34} />
        <h2 className="mt-3 text-lg font-bold text-slate-950">Ajoutez au moins 5 photos</h2>
        <p className="mt-2 text-sm text-slate-600">Profil, arrière, cockpit, équipement et mise à l&apos;eau.</p>
        <input type="file" multiple className="mt-5 text-sm" />
      </div>
    </StepShell>
  );
}

function SpecsStep() {
  return (
    <StepShell icon={<PackageCheck size={24} />} title="Caractéristiques">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Puissance" placeholder="170 hp" />
        <Input label="Équipement inclus" placeholder="Gilets, sac étanche" />
        <Input label="Politique annulation" placeholder="Flexible" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {["Mode débutant", "Audio marine", "Compartiment étanche", "Échelle arrière"].map((item) => (
          <label key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" className="size-4 accent-cyan-600" />
            {item}
          </label>
        ))}
      </div>
    </StepShell>
  );
}

function PricingStep() {
  return (
    <StepShell icon={<BadgeDollarSign size={24} />} title="Prix et dépôt">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Prix par jour" type="number" placeholder="320" />
        <Input label="Prix weekend" type="number" placeholder="360" />
        <Input label="Dépôt de sécurité" type="number" placeholder="750" />
      </div>
    </StepShell>
  );
}

function LocationStep() {
  return (
    <StepShell icon={<MapPin size={24} />} title="Localisation">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Adresse de récupération" placeholder="Britannia Beach, Ottawa" />
        <Input label="Zone visible publiquement" placeholder="Ottawa River" />
      </div>
      <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        L&apos;adresse exacte reste privée jusqu&apos;à la réservation confirmée.
      </div>
    </StepShell>
  );
}

function DeliveryStep() {
  return (
    <StepShell icon={<Truck size={24} />} title="Livraison ou récupération">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Livraison disponible" options={["Oui", "Non"]} />
        <Input label="Rayon de livraison" placeholder="20 km" />
        <Input label="Prix de livraison" type="number" placeholder="55" />
      </div>
    </StepShell>
  );
}

function AvailabilityStep() {
  return (
    <StepShell icon={<CalendarDays size={24} />} title="Disponibilités">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Disponible à partir du" type="date" />
        <Input label="Jours bloqués" placeholder="Lundi, mardi" />
        <Input label="Heures de départ" placeholder="9:00 - 17:00" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 21 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              "aspect-square rounded-lg border text-sm font-bold",
              index % 5 === 0 ? "border-rose-200 bg-rose-50 text-rose-700" : "border-cyan-200 bg-cyan-50 text-cyan-800",
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function RulesStep() {
  return (
    <StepShell icon={<ClipboardList size={24} />} title="Règles et conditions">
      <Textarea label="Règles de location" placeholder="Permis, zone autorisée, météo, carburant, dépôt." />
      <Textarea label="Politique d'annulation" placeholder="Remboursement complet jusqu'à 48 h avant." />
    </StepShell>
  );
}

function PreviewStep() {
  return (
    <StepShell icon={<CheckCircle2 size={24} />} title="Prévisualisation et publication">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
        <h2 className="text-xl font-bold text-slate-950">Sea-Doo GTX 170 · Britannia Beach</h2>
        <p className="mt-2 text-sm text-slate-600">
          Annonce prête avec prix clair, dépôt indiqué, livraison optionnelle et règles visibles.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Prix transparent", "Photos complètes", "Profil vérifié"].map((item) => (
            <span key={item} className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-800">
              {item}
            </span>
          ))}
        </div>
      </div>
    </StepShell>
  );
}

function StepShell({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-lg bg-cyan-50 text-cyan-700">{icon}</span>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      </div>
      <div className="mt-6 grid gap-5">{children}</div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <select className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Textarea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <textarea
        rows={4}
        placeholder={placeholder}
        className="rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
  );
}
