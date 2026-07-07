import Link from "next/link";
import { LockKeyhole, Mail } from "lucide-react";

export default function ConnexionPage() {
  return (
    <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[linear-gradient(180deg,#ecfeff,#f8fafc)] px-4 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-cyan-900/10">
        <p className="text-sm font-bold text-cyan-700">RideWave</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Connexion</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Courriel
            <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3">
              <Mail size={18} className="text-cyan-700" />
              <input type="email" placeholder="alex@exemple.ca" className="min-w-0 flex-1 bg-transparent outline-none" />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Mot de passe
            <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3">
              <LockKeyhole size={18} className="text-cyan-700" />
              <input type="password" placeholder="••••••••" className="min-w-0 flex-1 bg-transparent outline-none" />
            </span>
          </label>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#073b5d] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
          >
            Entrer
          </Link>
        </div>
        <p className="mt-5 text-center text-sm text-slate-600">
          Nouveau sur RideWave?{" "}
          <Link href="/inscription" className="font-bold text-cyan-700">
            Créer un compte
          </Link>
        </p>
      </section>
    </div>
  );
}
