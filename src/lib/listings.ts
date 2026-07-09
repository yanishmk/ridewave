import { getListing as getLocalListing, listings as localListings } from "@/lib/data";
import type { JetSkiListing } from "@/lib/data";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import type { JetSkiRow } from "@/lib/supabase/types";

function mapJetSkiRow(row: JetSkiRow): JetSkiListing {
  return {
    ownerId: row.owner_id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    model: row.model,
    year: row.year,
    type: row.type,
    location: row.location,
    area: row.area,
    coordinates: { x: row.coordinate_x, y: row.coordinate_y },
    passengers: row.passengers,
    horsepower: row.horsepower,
    pricePerDay: row.price_per_day,
    weekendPrice: row.weekend_price,
    deliveryFee: row.delivery_fee,
    deposit: row.deposit,
    serviceFee: row.service_fee,
    distanceKm: row.distance_km,
    rating: row.rating,
    reviews: row.reviews,
    deliveryAvailable: row.delivery_available,
    cancellation: row.cancellation,
    status: row.status,
    host: {
      name: row.host_name,
      avatar: row.host_avatar,
      rating: row.host_rating,
      responseTime: row.host_response_time,
      verified: row.host_verified,
      phone: row.host_phone,
    },
    images: row.images,
    features: row.features,
    equipment: row.equipment,
    rules: row.rules,
    description: row.description,
    navigationZone: row.navigation_zone,
  };
}

export async function getListings(): Promise<JetSkiListing[]> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return localListings;
  }

  const { data, error } = await supabase
    .from("jet_skis")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    console.warn("RideWave Supabase fallback:", error?.message ?? "empty jet_skis table");
    return localListings;
  }

  return data.map(mapJetSkiRow);
}

export async function getListingBySlug(slug: string): Promise<JetSkiListing | undefined> {
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return getLocalListing(slug);
  }

  const { data, error } = await supabase
    .from("jet_skis")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.warn("RideWave Supabase detail fallback:", error.message);
    }
    return getLocalListing(slug);
  }

  return mapJetSkiRow(data);
}

export async function getListingSlugs() {
  const listings = await getListings();
  return listings.map((listing) => listing.slug);
}

export async function getSimilarListings(slug: string, limit = 3) {
  const listings = await getListings();
  return listings.filter((listing) => listing.slug !== slug).slice(0, limit);
}
