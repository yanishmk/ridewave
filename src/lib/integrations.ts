export type IntegrationStatus = "planned" | "ready-for-key" | "mocked";

export const integrationRoadmap = [
  { name: "Stripe Payments", status: "ready-for-key" as IntegrationStatus },
  { name: "Stripe Identity ou Persona", status: "planned" as IntegrationStatus },
  { name: "Supabase Auth et Database", status: "planned" as IntegrationStatus },
  { name: "Mapbox ou Leaflet", status: "mocked" as IntegrationStatus },
  { name: "Email/SMS notifications", status: "planned" as IntegrationStatus },
  { name: "Chat temps réel", status: "mocked" as IntegrationStatus },
  { name: "Avis et notes", status: "mocked" as IntegrationStatus },
  { name: "Promotions et parrainage", status: "planned" as IntegrationStatus },
];
