import { CalendarDays, MapPin, ShipWheel, UsersRound } from "lucide-react";

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  return (
    <form
      action="/explorer"
      className={
        compact
          ? "grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1.1fr_1fr_1fr_.8fr_1fr_auto]"
          : "grid gap-3 rounded-lg bg-white/94 p-3 shadow-2xl shadow-slate-950/20 backdrop-blur md:grid-cols-[1.1fr_1fr_1fr_.8fr_1fr_auto]"
      }
    >
      <label className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <MapPin className="shrink-0 text-cyan-600" size={19} />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500">Ville ou zone</span>
          <select name="zone" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none">
            <option>Ottawa</option>
            <option>Gatineau</option>
            <option>Aylmer</option>
            <option>Lac Leamy</option>
          </select>
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <CalendarDays className="shrink-0 text-cyan-600" size={19} />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500">Début</span>
          <input name="start" type="date" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none" />
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <CalendarDays className="shrink-0 text-cyan-600" size={19} />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500">Retour</span>
          <input name="end" type="date" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none" />
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <UsersRound className="shrink-0 text-cyan-600" size={19} />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500">Personnes</span>
          <input name="people" type="number" min="1" max="3" defaultValue="2" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none" />
        </span>
      </label>

      <label className="flex min-h-14 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3">
        <ShipWheel className="shrink-0 text-cyan-600" size={19} />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs font-bold text-slate-500">Mode</span>
          <select name="mode" className="w-full bg-transparent text-sm font-semibold text-slate-950 outline-none">
            <option>Livraison</option>
            <option>Récupération</option>
          </select>
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-14 items-center justify-center rounded-lg bg-[#073b5d] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c]"
      >
        Rechercher
      </button>
    </form>
  );
}
