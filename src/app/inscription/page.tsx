import Link from "next/link";
import { BadgeCheck, Mail, UserRound } from "lucide-react";

export default function InscriptionPage() {
  return (
    <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[linear-gradient(180deg,#f0fdf4,#f8fafc)] px-4 py-12">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-emerald-900/10">
        <p className="text-sm font-bold text-cyan-700">Créer un compte</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Rejoindre RideWave</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Nom complet
            <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3">
              <UserRound size={18} className="text-cyan-700" />
              <input type="text" placeholder="Alex Martin" className="min-w-0 flex-1 bg-transparent outline-none" />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Courriel
            <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3">
              <Mail size={18} className="text-cyan-700" />
              <input type="email" placeholder="alex@exemple.ca" className="min-w-0 flex-1 bg-transparent outline-none" />
            </span>
          </label>
        </div>
        <div className="mt-4 rounded-lg bg-cyan-50 p-4 text-sm text-cyan-900">
          <p className="flex items-center gap-2 font-bold">
            <BadgeCheck size={18} />
            Compte client ou propriétaire
          </p>
          <p className="mt-1">Le profil pourra ensuite accueillir Stripe, vérification d&apos;identité et avis.</p>
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#073b5d] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
        >
          Créer mon compte
        </Link>
      </section>
    </div>
  );
}
