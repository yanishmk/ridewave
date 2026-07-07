import { ExplorerExperience } from "@/components/explorer-experience";
import { SearchPanel } from "@/components/search-panel";
import { listings } from "@/lib/data";

export default function ExplorerPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Explorer</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Trouvez un jet-ski disponible.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Comparez les offres autour de Britannia Beach, Lac Leamy, Aylmer, Chelsea et Parc Jacques-Cartier.
          </p>
          <div className="mt-6">
            <SearchPanel compact />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ExplorerExperience listings={listings} />
      </section>
    </div>
  );
}
