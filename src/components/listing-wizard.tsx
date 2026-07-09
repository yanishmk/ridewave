"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeDollarSign,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MapPin,
  PackageCheck,
  Save,
  ShipWheel,
  Truck,
} from "lucide-react";
import type { DashboardProfile } from "@/lib/dashboard-data";
import { imagePool, type JetSkiListing } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
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

type ListingForm = {
  brand: string;
  model: string;
  year: string;
  type: JetSkiListing["type"];
  passengers: string;
  horsepower: string;
  description: string;
  imageUrls: string;
  features: string;
  equipment: string;
  cancellation: JetSkiListing["cancellation"];
  pricePerDay: string;
  weekendPrice: string;
  deposit: string;
  location: string;
  area: string;
  navigationZone: string;
  deliveryAvailable: "Oui" | "Non";
  deliveryRadius: string;
  deliveryFee: string;
  availableFrom: string;
  blockedDays: string;
  departureWindow: string;
  rules: string;
};

const defaultForm: ListingForm = {
  brand: "",
  model: "",
  year: "2024",
  type: "Familial",
  passengers: "3",
  horsepower: "130",
  description: "",
  imageUrls: "",
  features: "Mode débutant\nGrand coffre\nÉchelle arrière",
  equipment: "Gilets VFI\nTrousse de sécurité\nSac étanche",
  cancellation: "Flexible",
  pricePerDay: "280",
  weekendPrice: "320",
  deposit: "650",
  location: "",
  area: "",
  navigationZone: "",
  deliveryAvailable: "Oui",
  deliveryRadius: "20 km",
  deliveryFee: "50",
  availableFrom: "",
  blockedDays: "",
  departureWindow: "9:00 - 17:00",
  rules: "Carte de conducteur d'embarcation obligatoire\nRetour avec le plein\nBriefing obligatoire au départ",
};

export function ListingWizard({ profile }: { profile: DashboardProfile }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ListingForm>(defaultForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listingName = useMemo(() => {
    const value = `${form.brand} ${form.model}`.trim();
    return value || "Votre jet-ski";
  }, [form.brand, form.model]);
  const slugPreview = useMemo(
    () => buildSlug(`${form.brand}-${form.model}-${form.location}`) || "nouveau-jet-ski",
    [form.brand, form.model, form.location],
  );
  const images = parseLines(form.imageUrls);

  function updateField<K extends keyof ListingForm>(key: K, value: ListingForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function nextStep() {
    setError(null);
    setStep((value) => Math.min(wizardSteps.length - 1, value + 1));
  }

  async function publishListing() {
    setError(null);
    const missing = getMissingFields(form);

    if (missing.length) {
      setError(`Champs à compléter : ${missing.join(", ")}.`);
      setStep(0);
      return;
    }

    setIsPublishing(true);

    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setIsPublishing(false);
      setError("Supabase doit être configuré avant de publier une annonce.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsPublishing(false);
      router.push("/connexion?redirectTo=%2Fproprietaire%2Fajouter");
      return;
    }

    const slug = `${slugPreview}-${Date.now().toString(36)}`;
    const featureLines = parseLines(form.features);
    const equipmentLines = parseLines(form.equipment);
    const ruleLines = [
      ...parseLines(form.rules),
      ...availabilityRules(form),
    ];
    const deliveryAvailable = form.deliveryAvailable === "Oui";
    const hostName = profile.name || user.email?.split("@")[0] || "Propriétaire RideWave";

    const { error: insertError } = await supabase.from("jet_skis").insert({
      owner_id: user.id,
      slug,
      name: listingName,
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: toNumber(form.year, 2024),
      type: form.type,
      location: form.location.trim(),
      area: form.area.trim() || form.location.trim(),
      coordinate_x: 50,
      coordinate_y: 50,
      passengers: toNumber(form.passengers, 3),
      horsepower: toNumber(form.horsepower, 130),
      price_per_day: toNumber(form.pricePerDay, 0),
      weekend_price: toNumber(form.weekendPrice, toNumber(form.pricePerDay, 0)),
      delivery_fee: deliveryAvailable ? toNumber(form.deliveryFee, 0) : 0,
      deposit: toNumber(form.deposit, 0),
      service_fee: 0,
      distance_km: 0,
      rating: 5,
      reviews: 0,
      delivery_available: deliveryAvailable,
      cancellation: form.cancellation,
      status: "active",
      host_name: hostName,
      host_avatar: initials(hostName),
      host_rating: 5,
      host_response_time: "Nouveau",
      host_verified: false,
      host_phone: profile.phone || "",
      images: images.length ? images : [imagePool.hero, imagePool.dock, imagePool.lake],
      features: deliveryAvailable && form.deliveryRadius.trim()
        ? [...featureLines, `Livraison jusqu'à ${form.deliveryRadius.trim()}`]
        : featureLines,
      equipment: equipmentLines,
      rules: ruleLines.length ? ruleLines : ["Conditions à confirmer avec le propriétaire"],
      description: form.description.trim(),
      navigation_zone: form.navigationZone.trim() || form.area.trim() || form.location.trim(),
    });

    setIsPublishing(false);

    if (insertError) {
      setError("Impossible de publier cette annonce. Vérifiez les champs et les politiques Supabase.");
      return;
    }

    router.push(`/jet-skis/${slug}`);
    router.refresh();
  }

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

        {error ? (
          <p className="mb-5 rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">
            {error}
          </p>
        ) : null}

        {step === 0 ? <GeneralStep form={form} updateField={updateField} /> : null}
        {step === 1 ? <PhotosStep form={form} updateField={updateField} imageCount={images.length} /> : null}
        {step === 2 ? <SpecsStep form={form} updateField={updateField} /> : null}
        {step === 3 ? <PricingStep form={form} updateField={updateField} /> : null}
        {step === 4 ? <LocationStep form={form} updateField={updateField} /> : null}
        {step === 5 ? <DeliveryStep form={form} updateField={updateField} /> : null}
        {step === 6 ? <AvailabilityStep form={form} updateField={updateField} /> : null}
        {step === 7 ? <RulesStep form={form} updateField={updateField} /> : null}
        {step === 8 ? (
          <PreviewStep
            form={form}
            listingName={listingName}
            slugPreview={slugPreview}
            profile={profile}
          />
        ) : null}

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={step === 0 || isPublishing}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="h-11 rounded-full border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
          >
            Retour
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={step === wizardSteps.length - 1 ? publishListing : nextStep}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c] disabled:translate-y-0 disabled:opacity-50"
          >
            {step === wizardSteps.length - 1
              ? isPublishing
                ? "Publication..."
                : "Publier l'annonce"
              : "Continuer"}
            {step === wizardSteps.length - 1 ? <Save size={17} /> : <ChevronRight size={17} />}
          </button>
        </div>
      </section>
    </div>
  );
}

function GeneralStep({
  form,
  updateField,
}: {
  form: ListingForm;
  updateField: UpdateField;
}) {
  return (
    <StepShell icon={<ShipWheel size={24} />} title="Informations générales">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Marque" value={form.brand} onChange={(value) => updateField("brand", value)} placeholder="Sea-Doo" />
        <Input label="Modèle" value={form.model} onChange={(value) => updateField("model", value)} placeholder="GTX 170" />
        <Input label="Année" type="number" value={form.year} onChange={(value) => updateField("year", value)} />
        <Select
          label="Catégorie"
          value={form.type}
          onChange={(value) => updateField("type", value as JetSkiListing["type"])}
          options={["Sport", "Familial", "Premium", "Débutant"]}
        />
        <Input label="Nombre de places" type="number" value={form.passengers} onChange={(value) => updateField("passengers", value)} />
        <Input label="Puissance" type="number" value={form.horsepower} onChange={(value) => updateField("horsepower", value)} />
      </div>
      <Textarea
        label="Description"
        value={form.description}
        onChange={(value) => updateField("description", value)}
        placeholder="Décrivez l'expérience, le confort et les conditions idéales."
      />
    </StepShell>
  );
}

function PhotosStep({
  form,
  updateField,
  imageCount,
}: {
  form: ListingForm;
  updateField: UpdateField;
  imageCount: number;
}) {
  return (
    <StepShell icon={<Camera size={24} />} title="Photos">
      <div className="rounded-lg border border-dashed border-cyan-300 bg-cyan-50 p-6">
        <Camera className="text-cyan-700" size={34} />
        <h2 className="mt-3 text-lg font-bold text-slate-950">Ajoutez les URLs de vos photos</h2>
        <p className="mt-2 text-sm text-slate-600">
          Une URL par ligne. Si vous laissez vide, RideWave utilisera des images temporaires.
        </p>
        <Textarea
          label="URLs photos"
          value={form.imageUrls}
          onChange={(value) => updateField("imageUrls", value)}
          placeholder="https://...\nhttps://..."
        />
        <p className="mt-3 text-xs font-bold text-cyan-800">
          {imageCount ? `${imageCount} photo(s) prêtes` : "Photos temporaires utilisées si aucune URL n'est ajoutée"}
        </p>
      </div>
    </StepShell>
  );
}

function SpecsStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<PackageCheck size={24} />} title="Caractéristiques">
      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea
          label="Caractéristiques visibles"
          value={form.features}
          onChange={(value) => updateField("features", value)}
          placeholder="Mode débutant\nAudio marine\nCompartiment étanche"
        />
        <Textarea
          label="Équipement inclus"
          value={form.equipment}
          onChange={(value) => updateField("equipment", value)}
          placeholder="Gilets\nSac étanche\nTrousse sécurité"
        />
      </div>
      <Select
        label="Politique d'annulation"
        value={form.cancellation}
        onChange={(value) => updateField("cancellation", value as JetSkiListing["cancellation"])}
        options={["Flexible", "Modérée", "Stricte"]}
      />
    </StepShell>
  );
}

function PricingStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<BadgeDollarSign size={24} />} title="Prix et dépôt">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Prix par jour" type="number" value={form.pricePerDay} onChange={(value) => updateField("pricePerDay", value)} />
        <Input label="Prix weekend" type="number" value={form.weekendPrice} onChange={(value) => updateField("weekendPrice", value)} />
        <Input label="Dépôt à prévoir" type="number" value={form.deposit} onChange={(value) => updateField("deposit", value)} />
      </div>
      <div className="rounded-lg bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
        Aucun paiement n&apos;est capturé au lancement. Ces montants servent à informer le client avant la demande.
      </div>
    </StepShell>
  );
}

function LocationStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<MapPin size={24} />} title="Localisation">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Lieu visible" value={form.location} onChange={(value) => updateField("location", value)} placeholder="Britannia Beach" />
        <Input label="Secteur" value={form.area} onChange={(value) => updateField("area", value)} placeholder="Ottawa River" />
      </div>
      <Textarea
        label="Zone de navigation"
        value={form.navigationZone}
        onChange={(value) => updateField("navigationZone", value)}
        placeholder="Zone recommandée : marina, rivière, lac, limites à respecter."
      />
    </StepShell>
  );
}

function DeliveryStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<Truck size={24} />} title="Livraison ou récupération">
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Livraison disponible"
          value={form.deliveryAvailable}
          onChange={(value) => updateField("deliveryAvailable", value as "Oui" | "Non")}
          options={["Oui", "Non"]}
        />
        <Input label="Rayon de livraison" value={form.deliveryRadius} onChange={(value) => updateField("deliveryRadius", value)} placeholder="20 km" />
        <Input label="Prix de livraison" type="number" value={form.deliveryFee} onChange={(value) => updateField("deliveryFee", value)} />
      </div>
    </StepShell>
  );
}

function AvailabilityStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<CalendarDays size={24} />} title="Disponibilités">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Disponible à partir du" type="date" value={form.availableFrom} onChange={(value) => updateField("availableFrom", value)} />
        <Input label="Jours bloqués" value={form.blockedDays} onChange={(value) => updateField("blockedDays", value)} placeholder="Lundi, mardi" />
        <Input label="Heures de départ" value={form.departureWindow} onChange={(value) => updateField("departureWindow", value)} />
      </div>
      <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-slate-600">
        Ces détails sont ajoutés aux règles de l&apos;annonce pour informer les clients avant leur demande.
      </div>
    </StepShell>
  );
}

function RulesStep({ form, updateField }: { form: ListingForm; updateField: UpdateField }) {
  return (
    <StepShell icon={<ClipboardList size={24} />} title="Règles et conditions">
      <Textarea
        label="Règles de location"
        value={form.rules}
        onChange={(value) => updateField("rules", value)}
        placeholder="Permis, zone autorisée, météo, carburant, dépôt."
      />
    </StepShell>
  );
}

function PreviewStep({
  form,
  listingName,
  slugPreview,
  profile,
}: {
  form: ListingForm;
  listingName: string;
  slugPreview: string;
  profile: DashboardProfile;
}) {
  return (
    <StepShell icon={<CheckCircle2 size={24} />} title="Prévisualisation et publication">
      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
        <h2 className="text-xl font-bold text-slate-950">{listingName} · {form.location || "Lieu à compléter"}</h2>
        <p className="mt-2 text-sm text-slate-600">
          Publié par {profile.name}. Slug prévu : <span className="font-bold">{slugPreview}</span>.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PreviewPill label="Prix" value={`${form.pricePerDay || "0"} $ / jour`} />
          <PreviewPill label="Dépôt" value={`${form.deposit || "0"} $`} />
          <PreviewPill label="Livraison" value={form.deliveryAvailable} />
        </div>
        <p className="mt-4 text-sm font-semibold text-cyan-900">
          Une fois publiée, l&apos;annonce devient active et visible publiquement dans Explorer.
        </p>
      </div>
    </StepShell>
  );
}

function PreviewPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-800">
      {label} : {value}
    </span>
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
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <textarea
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-200 px-3 py-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

type UpdateField = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) => void;

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function availabilityRules(form: ListingForm) {
  return [
    form.availableFrom ? `Disponible à partir du ${form.availableFrom}` : "",
    form.blockedDays ? `Jours indisponibles : ${form.blockedDays}` : "",
    form.departureWindow ? `Heures de départ : ${form.departureWindow}` : "",
  ].filter(Boolean);
}

function getMissingFields(form: ListingForm) {
  const required: Array<[keyof ListingForm, string]> = [
    ["brand", "marque"],
    ["model", "modèle"],
    ["year", "année"],
    ["passengers", "places"],
    ["horsepower", "puissance"],
    ["description", "description"],
    ["pricePerDay", "prix par jour"],
    ["deposit", "dépôt"],
    ["location", "lieu"],
    ["area", "secteur"],
  ];

  return required
    .filter(([key]) => !String(form[key]).trim())
    .map(([, label]) => label);
}

function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RW";
}
