"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, Waves, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/explorer", label: "Explorer" },
  { href: "/proprietaire", label: "Devenir propriétaire" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/messages", label: "Messages" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="RideWave accueil">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#073b5d] text-white shadow-sm">
            <Waves size={22} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-bold text-slate-950">RideWave</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-[#073b5d]",
                  active && "bg-[#e8f8fb] text-[#073b5d]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/connexion"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <UserRound size={17} />
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#073b5d] px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
          >
            Créer un compte
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid size-11 place-items-center rounded-full border border-slate-200 text-slate-800 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-2" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-slate-800 hover:bg-cyan-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-slate-100 pt-3">
              <Link
                href="/connexion"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-[#073b5d] px-3 py-3 text-center text-base font-semibold text-white"
              >
                Créer un compte
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
