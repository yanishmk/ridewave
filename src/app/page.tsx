import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CreditCard,
  Headphones,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { AnimatedSection } from "@/components/animated-section";
import { ListingCard } from "@/components/listing-card";
import { SearchPanel } from "@/components/search-panel";
import { categories, imagePool, listings } from "@/lib/data";

const trustItems = [
  { icon: CreditCard, title: "Paiement sécurisé", copy: "Cartes, dépôt et frais visibles avant confirmation." },
  { icon: BadgeCheck, title: "Propriétaires vérifiés", copy: "Profils locaux, notes et temps de réponse affichés." },
  { icon: Headphones, title: "Assistance locale", copy: "Support Ottawa-Gatineau pour les questions terrain." },
  { icon: ShieldCheck, title: "Conditions transparentes", copy: "Assurance, règles et annulation lisibles avant paiement." },
];

const steps = [
  {
    title: "Choisissez votre jet-ski",
    copy: "Comparez les prix, l'emplacement, les avis et les options de livraison.",
  },
  {
    title: "Réservez en ligne",
    copy: "Ajoutez dates, passagers, adresse de livraison et paiement sécurisé.",
  },
  {
    title: "Profitez de l'eau",
    copy: "Briefing, équipement inclus et contact direct avec le propriétaire.",
  },
];

export default function Home() {
  const popular = listings.slice(0, 3);

  return (
    <div className="bg-slate-50">
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-slate-950">
        <Image
          src={imagePool.hero}
          alt="Jet-ski sur l'eau"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,22,36,.82),rgba(3,22,36,.28),rgba(3,22,36,.12))]" />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              <Waves size={18} />
              Ottawa · Gatineau · Aylmer · Lac Leamy
            </span>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Louez un jet-ski et vivez Ottawa-Gatineau autrement.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-cyan-50 sm:text-xl">
              Réservez facilement un jet-ski près de chez vous, avec récupération sur place ou
              livraison directement au quai.
            </p>
          </div>
          <div className="mt-8 max-w-6xl">
            <SearchPanel />
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-cyan-700">Près de vous</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Jet-skis populaires</h2>
          </div>
          <Link
            href="/explorer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
          >
            Tout explorer
          </Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {popular.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-cyan-700">Catégories</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Trouvez la bonne sortie</h2>
            </div>
            <Sparkles className="hidden text-orange-500 sm:block" size={30} />
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article key={category.title} className="group relative min-h-60 overflow-hidden rounded-lg">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{category.title}</h3>
                  <p className="mt-2 text-sm text-cyan-50">{category.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="comment-ca-marche" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-cyan-700">Réservation rapide</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Comment ça marche</h2>
            <p className="mt-4 text-slate-600">
              Un parcours court, clair et conçu pour réserver une sortie en moins de deux minutes.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <span className="grid size-11 place-items-center rounded-lg bg-[#073b5d] text-lg font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-[#073b5d] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-white/14 bg-white/8 p-5 backdrop-blur">
                  <Icon className="text-cyan-200" size={26} />
                  <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-cyan-50">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_.85fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold text-cyan-700">Propriétaires</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Rentabilisez votre jet-ski entre deux sorties.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Prix par jour, weekend, livraison, calendrier, messages et revenus : tout est prévu
              pour publier une annonce sérieuse rapidement.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/proprietaire/ajouter"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#073b5d] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
              >
                Ajouter un jet-ski
              </Link>
              <Link
                href="/proprietaire"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                <LifeBuoy size={18} />
                Voir le dashboard
              </Link>
            </div>
          </div>
          <div className="relative min-h-80">
            <Image src={imagePool.dock} alt="Jet-ski à quai" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
