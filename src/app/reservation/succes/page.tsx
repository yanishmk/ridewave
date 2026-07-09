import { SuccessAnimation } from "@/components/success-animation";
import { getListingBySlug, getListings } from "@/lib/listings";

export default async function ReservationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ jet?: string }>;
}) {
  const { jet } = await searchParams;
  const listings = await getListings();
  const listing = (jet ? await getListingBySlug(jet) : undefined) ?? listings[0];

  return (
    <div className="bg-[linear-gradient(180deg,#ecfeff,#f8fafc)] px-4 py-12 sm:px-6 lg:px-8">
      <SuccessAnimation listing={listing} />
    </div>
  );
}
