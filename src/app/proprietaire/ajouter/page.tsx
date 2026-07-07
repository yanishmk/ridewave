import { ListingWizard } from "@/components/listing-wizard";

export default function AddListingPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Création d&apos;annonce</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Ajoutez votre jet-ski à RideWave.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Un formulaire en étapes pour publier une annonce claire, vérifiable et prête à recevoir des réservations.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ListingWizard />
      </section>
    </div>
  );
}
