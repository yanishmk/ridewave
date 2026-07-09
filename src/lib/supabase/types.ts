import type { JetSkiListing } from "@/lib/data";

export type JetSkiRow = {
  id: string;
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

export type Database = {
  public: {
    Tables: {
      jet_skis: {
        Row: JetSkiRow;
        Insert: Omit<JetSkiRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<JetSkiRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
