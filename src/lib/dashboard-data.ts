import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  ConversationRow,
  Database,
  JetSkiRow,
  MessageRow,
  ProfileRow,
  RentalRequestRow,
  RentalRequestStatus,
} from "@/lib/supabase/types";

type Supabase = SupabaseClient<Database>;

export type DashboardProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: ProfileRow["role"];
  boatingCard: string;
  preference: string;
  initials: string;
};

export type ClientRequest = {
  id: string;
  listingSlug: string | null;
  listingName: string;
  dateRange: string;
  status: RentalRequestStatus;
  statusLabel: string;
  location: string;
  estimateTotal: number;
  mode: RentalRequestRow["mode"];
  modeLabel: string;
};

export type FavoriteListing = {
  slug: string;
  name: string;
  location: string;
  pricePerDay: number;
};

export type DashboardConversation = {
  id: string;
  host: string;
  listing: string;
  status: string;
  unread: number;
  messages: {
    from: "client" | "host";
    text: string;
    time: string;
  }[];
};

export type OwnerLead = {
  id: string;
  listingName: string;
  dateRange: string;
  location: string;
  estimate: number;
  client: string;
  status: RentalRequestStatus;
  statusLabel: string;
};

export type OwnerListingDashboard = {
  slug: string;
  name: string;
  location: string;
  pricePerDay: number;
  weekendPrice: number;
  status: JetSkiRow["status"];
  rating: number;
  reviews: number;
};

export type ClientDashboardData = {
  profile: DashboardProfile;
  requests: ClientRequest[];
  favorites: FavoriteListing[];
  conversations: DashboardConversation[];
};

export type OwnerDashboardData = {
  profile: DashboardProfile;
  leads: OwnerLead[];
  listings: OwnerListingDashboard[];
  demandBars: number[];
};

const requestStatusLabels: Record<RentalRequestStatus, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Refusée",
  cancelled: "Annulée",
  completed: "Terminée",
};

const conversationStatusLabels: Record<ConversationRow["status"], string> = {
  request: "Demande en cours",
  confirmed: "Demande acceptée",
  open: "Question ouverte",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RW";
}

function fallbackName(user: User) {
  const metadataName = user.user_metadata?.full_name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user.email?.split("@")[0] ?? "Utilisateur";
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate) {
    return "Date à définir";
  }

  const formatter = new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const start = formatter.format(new Date(startDate));

  if (!endDate || endDate === startDate) {
    return start;
  }

  return `${start} - ${formatter.format(new Date(endDate))}`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapRequest(row: RentalRequestRow): ClientRequest {
  return {
    id: row.id,
    listingSlug: row.listing_slug,
    listingName: row.listing_name,
    dateRange: formatDateRange(row.start_date, row.end_date),
    status: row.status,
    statusLabel: requestStatusLabels[row.status],
    location: row.location,
    estimateTotal: row.estimate_total,
    mode: row.mode,
    modeLabel: row.mode === "delivery" ? "Livraison" : "Récupération",
  };
}

function mapOwnerLead(row: RentalRequestRow): OwnerLead {
  return {
    id: row.id,
    listingName: row.listing_name,
    dateRange: formatDateRange(row.start_date, row.end_date),
    location: row.location,
    estimate: row.estimate_total,
    client: row.client_name,
    status: row.status,
    statusLabel: requestStatusLabels[row.status],
  };
}

function mapOwnerListing(row: JetSkiRow): OwnerListingDashboard {
  return {
    slug: row.slug,
    name: row.name,
    location: row.location,
    pricePerDay: row.price_per_day,
    weekendPrice: row.weekend_price,
    status: row.status,
    rating: row.rating,
    reviews: row.reviews,
  };
}

export async function getProfile(supabase: Supabase, user: User): Promise<DashboardProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.warn("RideWave profile fallback:", error.message);
  }

  const name = data?.full_name?.trim() || fallbackName(user);
  const email = data?.email || user.email || "";

  return {
    id: user.id,
    email,
    name,
    phone: data?.phone ?? "",
    role: data?.role ?? "client",
    boatingCard: data?.boating_card ?? "",
    preference: data?.preference ?? "",
    initials: initials(name),
  };
}

export async function getClientDashboardData(
  supabase: Supabase,
  user: User,
): Promise<ClientDashboardData> {
  const profile = await getProfile(supabase, user);

  const [{ data: requestRows, error: requestsError }, conversations] = await Promise.all([
    supabase
      .from("rental_requests")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false }),
    getConversations(supabase, user),
  ]);

  if (requestsError) {
    console.warn("RideWave client requests fallback:", requestsError.message);
  }

  return {
    profile,
    requests: (requestRows ?? []).map(mapRequest),
    favorites: await getFavorites(supabase, user.id),
    conversations,
  };
}

export async function getOwnerDashboardData(
  supabase: Supabase,
  user: User,
): Promise<OwnerDashboardData> {
  const profile = await getProfile(supabase, user);

  const [{ data: leadRows, error: leadsError }, { data: listingRows, error: listingsError }] =
    await Promise.all([
      supabase
        .from("rental_requests")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("jet_skis")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  if (leadsError) {
    console.warn("RideWave owner leads fallback:", leadsError.message);
  }
  if (listingsError) {
    console.warn("RideWave owner listings fallback:", listingsError.message);
  }

  const leads = (leadRows ?? []).map(mapOwnerLead);

  return {
    profile,
    leads,
    listings: (listingRows ?? []).map(mapOwnerListing),
    demandBars: buildDemandBars(leadRows ?? []),
  };
}

export async function getConversations(supabase: Supabase, user: User) {
  const { data: conversationRows, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`client_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("RideWave conversations fallback:", error.message);
    return [];
  }

  if (!conversationRows?.length) {
    return [];
  }

  const conversationIds = conversationRows.map((conversation) => conversation.id);
  const { data: messageRows, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.warn("RideWave messages fallback:", messagesError.message);
  }

  return conversationRows.map((conversation) =>
    mapConversation(conversation, messageRows ?? [], user.id),
  );
}

async function getFavorites(supabase: Supabase, userId: string): Promise<FavoriteListing[]> {
  const { data: favoriteRows, error } = await supabase
    .from("favorites")
    .select("listing_slug")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("RideWave favorites fallback:", error.message);
    return [];
  }

  const slugs = favoriteRows?.map((favorite) => favorite.listing_slug) ?? [];
  if (!slugs.length) {
    return [];
  }

  const { data: listingRows, error: listingsError } = await supabase
    .from("jet_skis")
    .select("slug,name,location,price_per_day")
    .in("slug", slugs);

  if (listingsError) {
    console.warn("RideWave favorite listings fallback:", listingsError.message);
    return [];
  }

  return (listingRows ?? []).map((listing) => ({
    slug: listing.slug,
    name: listing.name,
    location: listing.location,
    pricePerDay: listing.price_per_day,
  }));
}

function mapConversation(
  conversation: ConversationRow,
  messages: MessageRow[],
  userId: string,
): DashboardConversation {
  const userIsClient = conversation.client_id === userId;

  return {
    id: conversation.id,
    host: userIsClient ? conversation.owner_name : conversation.client_name,
    listing: conversation.listing_name,
    status: conversationStatusLabels[conversation.status],
    unread: userIsClient ? conversation.unread_for_client : conversation.unread_for_owner,
    messages: messages
      .filter((message) => message.conversation_id === conversation.id)
      .map((message) => ({
        from: message.sender_id === userId ? "client" : "host",
        text: message.body,
        time: formatTime(message.created_at),
      })),
  };
}

function buildDemandBars(rows: RentalRequestRow[]) {
  const buckets = Array.from({ length: 12 }, () => 0);

  rows.forEach((row) => {
    const day = new Date(row.created_at).getDate();
    buckets[(day - 1) % buckets.length] += 1;
  });

  const max = Math.max(...buckets, 1);
  return buckets.map((value) => (value ? Math.max(16, Math.round((value / max) * 100)) : 0));
}
