import { BookingFlow } from "@/components/booking-flow";
import { getListingBySlug, getListings } from "@/lib/listings";

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ jet?: string }>;
}) {
  const { jet } = await searchParams;
  const listings = await getListings();
  const listing = (jet ? await getListingBySlug(jet) : undefined) ?? listings[0];

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-cyan-700">Réservation</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-950">Finalisez votre sortie sur l&apos;eau.</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Un parcours rapide avec frais, dépôt, identité et paiement affichés avant confirmation.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookingFlow listing={listing} />
      </section>
    </div>
  );
}
