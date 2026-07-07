import Link from "next/link";
import { Briefcase, Camera, Mail, UsersRound, Waves } from "lucide-react";

const columns = [
  {
    title: "Marketplace",
    links: [
      { href: "/explorer", label: "Explorer les jet-skis" },
      { href: "/reservation", label: "Réserver" },
      { href: "/dashboard", label: "Mes réservations" },
    ],
  },
  {
    title: "Propriétaires",
    links: [
      { href: "/proprietaire", label: "Tableau de bord" },
      { href: "/proprietaire/ajouter", label: "Publier une annonce" },
      { href: "/messages", label: "Messages" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/#comment-ca-marche", label: "Comment ça marche" },
      { href: "/connexion", label: "Connexion" },
      { href: "/inscription", label: "Créer un compte" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#073b5d] text-white">
              <Waves size={21} />
            </span>
            <span className="text-xl font-bold text-slate-950">RideWave</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            Location de jet-skis entre particuliers à Ottawa et Gatineau, avec réservation rapide,
            frais transparents et propriétaires vérifiés.
          </p>
          <div className="mt-5 flex items-center gap-3 text-slate-600">
            <Link href="#" aria-label="Instagram" className="grid size-10 place-items-center rounded-full border border-slate-200 hover:text-[#073b5d]">
              <Camera size={18} />
            </Link>
            <Link href="#" aria-label="Facebook" className="grid size-10 place-items-center rounded-full border border-slate-200 hover:text-[#073b5d]">
              <UsersRound size={18} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="grid size-10 place-items-center rounded-full border border-slate-200 hover:text-[#073b5d]">
              <Briefcase size={18} />
            </Link>
            <Link href="mailto:aide@ridewave.ca" aria-label="Courriel" className="grid size-10 place-items-center rounded-full border border-slate-200 hover:text-[#073b5d]">
              <Mail size={18} />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-slate-950">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-[#073b5d]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-5 text-center text-xs text-slate-500">
        © 2026 RideWave Canada. Conditions, sécurité nautique et confidentialité.
      </div>
    </footer>
  );
}
