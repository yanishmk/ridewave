import type { JetSkiListing } from "@/lib/data";

export type JetSkiRow = {
  id: string;
  owner_id: string | null;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: JetSkiListing["type"];
  location: string;
  area: string;
  coordinate_x: number;
  coordinate_y: number;
  passengers: number;
  horsepower: number;
  price_per_day: number;
  weekend_price: number;
  delivery_fee: number;
  deposit: number;
  service_fee: number;
  distance_km: number;
  rating: number;
  reviews: number;
  delivery_available: boolean;
  cancellation: JetSkiListing["cancellation"];
  status: JetSkiListing["status"];
  host_name: string;
  host_avatar: string;
  host_rating: number;
  host_response_time: string;
  host_verified: boolean;
  host_phone: string;
  images: string[];
  features: string[];
  equipment: string[];
  rules: string[];
  description: string;
  navigation_zone: string;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: "client" | "owner" | "both";
  boating_card: string | null;
  preference: string | null;
  created_at: string;
  updated_at: string;
};

export type RentalRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

export type RentalRequestRow = {
  id: string;
  client_id: string;
  owner_id: string | null;
  listing_slug: string | null;
  listing_name: string;
  client_name: string;
  start_date: string | null;
  end_date: string | null;
  status: RentalRequestStatus;
  location: string;
  estimate_total: number;
  mode: "delivery" | "pickup";
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type FavoriteRow = {
  user_id: string;
  listing_slug: string;
  created_at: string;
};

export type ConversationStatus = "request" | "confirmed" | "open";

export type ConversationRow = {
  id: string;
  client_id: string;
  owner_id: string | null;
  listing_slug: string | null;
  listing_name: string;
  client_name: string;
  owner_name: string;
  status: ConversationStatus;
  unread_for_client: number;
  unread_for_owner: number;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProfileRow, "id" | "created_at">>;
        Relationships: [];
      };
      jet_skis: {
        Row: JetSkiRow;
        Insert: Omit<JetSkiRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<JetSkiRow>;
        Relationships: [];
      };
      rental_requests: {
        Row: RentalRequestRow;
        Insert: Omit<RentalRequestRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<RentalRequestRow, "id" | "client_id" | "created_at">>;
        Relationships: [];
      };
      favorites: {
        Row: FavoriteRow;
        Insert: FavoriteRow;
        Update: Partial<FavoriteRow>;
        Relationships: [];
      };
      conversations: {
        Row: ConversationRow;
        Insert: Omit<ConversationRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ConversationRow, "id" | "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: Omit<MessageRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<MessageRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
