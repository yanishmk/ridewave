export type ListingStatus = "active" | "paused";
export type BookingStatus =
  | "En attente"
  | "Confirmée"
  | "Terminée"
  | "Annulée"
  | "À venir aujourd'hui";

export type JetSkiListing = {
  ownerId?: string | null;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: "Sport" | "Familial" | "Premium" | "Débutant";
  location: string;
  area: string;
  coordinates: { x: number; y: number };
  passengers: number;
  horsepower: number;
  pricePerDay: number;
  weekendPrice: number;
  deliveryFee: number;
  deposit: number;
  serviceFee: number;
  distanceKm: number;
  rating: number;
  reviews: number;
  deliveryAvailable: boolean;
  cancellation: "Flexible" | "Modérée" | "Stricte";
  status: ListingStatus;
  host: {
    name: string;
    avatar: string;
    rating: number;
    responseTime: string;
    verified: boolean;
    phone: string;
  };
  images: string[];
  features: string[];
  equipment: string[];
  rules: string[];
  description: string;
  navigationZone: string;
};

export type Booking = {
  id: string;
  listingSlug: string;
  listingName: string;
  dateRange: string;
  status: BookingStatus;
  location: string;
  total: number;
  mode: "Livraison" | "Récupération";
};

export type Conversation = {
  id: string;
  host: string;
  listing: string;
  status: "Réservation confirmée" | "Pré-demande" | "Question ouverte";
  unread: number;
  messages: {
    from: "client" | "host";
    text: string;
    time: string;
  }[];
};

export const imagePool = {
  hero:
    "https://upload.wikimedia.org/wikipedia/commons/1/17/Couple_of_teenagers_riding_a_jetski_splashing_on_the_Mekong_in_Laos.jpg",
  dock:
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/2021_RecDeck_Platform_01.jpg",
  lake:
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1400&q=80",
  river:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  marina:
    "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=1400&q=80",
  shoreline:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
};

export const listings: JetSkiListing[] = [
  {
    slug: "sea-doo-gtx-170-britannia",
    name: "Sea-Doo GTX 170 Signature",
    brand: "Sea-Doo",
    model: "GTX 170",
    year: 2024,
    type: "Premium",
    location: "Britannia Beach",
    area: "Ottawa River",
    coordinates: { x: 41, y: 47 },
    passengers: 3,
    horsepower: 170,
    pricePerDay: 320,
    weekendPrice: 360,
    deliveryFee: 55,
    deposit: 750,
    serviceFee: 42,
    distanceKm: 8,
    rating: 4.96,
    reviews: 42,
    deliveryAvailable: true,
    cancellation: "Flexible",
    status: "active",
    host: {
      name: "Maya Tremblay",
      avatar: "MT",
      rating: 4.98,
      responseTime: "12 min",
      verified: true,
      phone: "+1 613 555 0148",
    },
    images: [imagePool.hero, imagePool.dock, imagePool.lake],
    features: ["Mode éco", "Cruise control", "Compartiment étanche", "Sonde profondeur"],
    equipment: ["Gilets VFI", "Corde de remorquage", "Sac étanche", "Trousse de sécurité"],
    rules: [
      "Permis bateau ou carte de conducteur obligatoire",
      "Retour avec le plein",
      "Navigation entre Britannia et Parc Jacques-Cartier",
    ],
    description:
      "Un GTX très stable, confortable à deux ou trois passagers, parfait pour une sortie premium sur la rivière des Outaouais. Idéal pour découvrir les quais, les plages et les zones calmes avec une conduite souple.",
    navigationZone:
      "Zone recommandée : Britannia Beach, Deschênes Rapids et section balisée vers Aylmer.",
  },
  {
    slug: "yamaha-vx-cruiser-aylmer",
    name: "Yamaha VX Cruiser Aylmer",
    brand: "Yamaha",
    model: "VX Cruiser HO",
    year: 2023,
    type: "Familial",
    location: "Aylmer Marina",
    area: "Gatineau",
    coordinates: { x: 31, y: 54 },
    passengers: 3,
    horsepower: 125,
    pricePerDay: 280,
    weekendPrice: 315,
    deliveryFee: 45,
    deposit: 650,
    serviceFee: 36,
    distanceKm: 14,
    rating: 4.88,
    reviews: 31,
    deliveryAvailable: true,
    cancellation: "Modérée",
    status: "active",
    host: {
      name: "Olivier Paquette",
      avatar: "OP",
      rating: 4.91,
      responseTime: "24 min",
      verified: true,
      phone: "+1 819 555 0192",
    },
    images: [imagePool.dock, imagePool.hero, imagePool.shoreline],
    features: ["Siège confort", "Échelle arrière", "Mode débutant", "Grand coffre"],
    equipment: ["3 gilets", "Ancre légère", "Carte nautique", "Bluetooth étanche"],
    rules: [
      "Minimum 21 ans",
      "Briefing de 15 minutes inclus",
      "Aucune sortie en cas d'orage annoncé",
    ],
    description:
      "Un WaveRunner fiable et rassurant, très apprécié par les familles et les couples qui veulent une journée simple, sécurisée et agréable près d'Aylmer.",
    navigationZone:
      "Zone recommandée : Aylmer, baie de Deschênes et corridors calmes côté Gatineau.",
  },
  {
    slug: "sea-doo-spark-trixx-lac-leamy",
    name: "Sea-Doo Spark Trixx",
    brand: "Sea-Doo",
    model: "Spark Trixx",
    year: 2022,
    type: "Sport",
    location: "Lac Leamy",
    area: "Gatineau",
    coordinates: { x: 61, y: 34 },
    passengers: 2,
    horsepower: 90,
    pricePerDay: 220,
    weekendPrice: 250,
    deliveryFee: 35,
    deposit: 500,
    serviceFee: 28,
    distanceKm: 5,
    rating: 4.84,
    reviews: 27,
    deliveryAvailable: false,
    cancellation: "Flexible",
    status: "active",
    host: {
      name: "Nadia Bisson",
      avatar: "NB",
      rating: 4.87,
      responseTime: "18 min",
      verified: true,
      phone: "+1 819 555 0177",
    },
    images: [imagePool.hero, imagePool.river, imagePool.lake],
    features: ["Mode sport", "Guidon ajustable", "Trim étendu", "Coque légère"],
    equipment: ["2 gilets", "Sifflet", "Ligne flottante", "Bidon sécurité"],
    rules: [
      "Expérience recommandée",
      "Pas de figures près des quais",
      "Zone de pratique indiquée au départ",
    ],
    description:
      "Compact, joueur et très réactif. Le Spark Trixx est parfait pour une sortie sportive courte avec des sensations immédiates.",
    navigationZone:
      "Zone recommandée : départ Lac Leamy avec navigation calme selon les conditions locales.",
  },
  {
    slug: "kawasaki-ultra-chelsea",
    name: "Kawasaki Ultra LX Chelsea",
    brand: "Kawasaki",
    model: "Ultra LX",
    year: 2021,
    type: "Débutant",
    location: "Chelsea",
    area: "Gatineau Hills",
    coordinates: { x: 71, y: 22 },
    passengers: 3,
    horsepower: 160,
    pricePerDay: 260,
    weekendPrice: 300,
    deliveryFee: 60,
    deposit: 600,
    serviceFee: 34,
    distanceKm: 19,
    rating: 4.79,
    reviews: 19,
    deliveryAvailable: true,
    cancellation: "Modérée",
    status: "active",
    host: {
      name: "Samuel Leduc",
      avatar: "SL",
      rating: 4.82,
      responseTime: "31 min",
      verified: true,
      phone: "+1 873 555 0115",
    },
    images: [imagePool.lake, imagePool.dock, imagePool.hero],
    features: ["Mode lent", "Plateforme large", "Rangement avant", "Stabilité renforcée"],
    equipment: ["3 gilets", "GPS portable", "Kit premiers soins", "Protection téléphone"],
    rules: [
      "Briefing obligatoire",
      "Navigation lente dans les zones de quai",
      "Livraison possible sur quai privé vérifié",
    ],
    description:
      "Un modèle stable et simple à prendre en main. Très bon choix pour une première location accompagnée d'un briefing clair.",
    navigationZone:
      "Zone recommandée : secteurs calmes validés avec le propriétaire selon le quai choisi.",
  },
  {
    slug: "yamaha-fx-ho-parc-jacques-cartier",
    name: "Yamaha FX HO Parc",
    brand: "Yamaha",
    model: "FX HO",
    year: 2024,
    type: "Premium",
    location: "Parc Jacques-Cartier",
    area: "Gatineau",
    coordinates: { x: 55, y: 43 },
    passengers: 3,
    horsepower: 180,
    pricePerDay: 340,
    weekendPrice: 390,
    deliveryFee: 50,
    deposit: 800,
    serviceFee: 45,
    distanceKm: 3,
    rating: 4.99,
    reviews: 53,
    deliveryAvailable: true,
    cancellation: "Flexible",
    status: "active",
    host: {
      name: "Claire Morin",
      avatar: "CM",
      rating: 5,
      responseTime: "9 min",
      verified: true,
      phone: "+1 613 555 0188",
    },
    images: [imagePool.dock, imagePool.shoreline, imagePool.hero],
    features: ["Écran couleur", "Audio marine", "Régulateur", "Confort longue distance"],
    equipment: ["3 gilets premium", "Glacière souple", "Sac sec", "Radio VHF"],
    rules: [
      "Carte conducteur obligatoire",
      "Pas de remorquage sans autorisation",
      "Assurance et dépôt validés avant départ",
    ],
    description:
      "Une expérience haut de gamme pour longer la rive entre Ottawa et Gatineau avec confort, stabilité et beaucoup de rangement.",
    navigationZone:
      "Zone recommandée : Parc Jacques-Cartier, Musée canadien de l'histoire et boucles panoramiques balisées.",
  },
  {
    slug: "sea-doo-wake-pro-ottawa-river",
    name: "Sea-Doo Wake Pro 230",
    brand: "Sea-Doo",
    model: "Wake Pro 230",
    year: 2023,
    type: "Sport",
    location: "Ottawa River",
    area: "Centre-ville",
    coordinates: { x: 48, y: 52 },
    passengers: 3,
    horsepower: 230,
    pricePerDay: 360,
    weekendPrice: 410,
    deliveryFee: 65,
    deposit: 900,
    serviceFee: 48,
    distanceKm: 6,
    rating: 4.9,
    reviews: 24,
    deliveryAvailable: true,
    cancellation: "Stricte",
    status: "active",
    host: {
      name: "Karim Haddad",
      avatar: "KH",
      rating: 4.93,
      responseTime: "16 min",
      verified: true,
      phone: "+1 613 555 0161",
    },
    images: [imagePool.hero, imagePool.river, imagePool.dock],
    features: ["Mât wake", "Mode ski", "Audio", "Plateforme LinQ"],
    equipment: ["Gilets sport", "Corde wake", "Miroir", "Sac étanche"],
    rules: [
      "Expérience requise",
      "Wake autorisé seulement dans les zones permises",
      "Inspection coque au retour",
    ],
    description:
      "Puissant, stable et équipé pour les amateurs de sensations. Idéal pour une sortie sportive encadrée sur l'Outaouais.",
    navigationZone:
      "Zone recommandée : Ottawa River, avec wake uniquement dans les sections autorisées et dégagées.",
  },
  {
    slug: "yamaha-superjet-britannia-compact",
    name: "Yamaha SuperJet Compact",
    brand: "Yamaha",
    model: "SuperJet",
    year: 2022,
    type: "Sport",
    location: "Britannia Beach",
    area: "Ottawa River",
    coordinates: { x: 38, y: 44 },
    passengers: 1,
    horsepower: 100,
    pricePerDay: 210,
    weekendPrice: 240,
    deliveryFee: 30,
    deposit: 500,
    serviceFee: 26,
    distanceKm: 9,
    rating: 4.76,
    reviews: 18,
    deliveryAvailable: false,
    cancellation: "Flexible",
    status: "active",
    host: {
      name: "Etienne Roy",
      avatar: "ER",
      rating: 4.8,
      responseTime: "22 min",
      verified: true,
      phone: "+1 613 555 0133",
    },
    images: [imagePool.river, imagePool.hero, imagePool.lake],
    features: ["Format solo", "Coque agile", "Mode sport", "Faible consommation"],
    equipment: ["Gilet sport", "Sifflet", "Ligne flottante", "Sac sec compact"],
    rules: [
      "Expérience nautique recommandée",
      "Départ seulement depuis Britannia Beach",
      "Aucune navigation après 18:00",
    ],
    description:
      "Un jet-ski solo agile pour les pilotes qui veulent une sortie courte, vive et facile à organiser à Britannia Beach.",
    navigationZone:
      "Zone recommandée : boucle locale autour de Britannia Beach selon les conditions de courant.",
  },
  {
    slug: "sea-doo-fishpro-aylmer",
    name: "Sea-Doo FishPro Scout",
    brand: "Sea-Doo",
    model: "FishPro Scout",
    year: 2023,
    type: "Familial",
    location: "Aylmer",
    area: "Gatineau",
    coordinates: { x: 28, y: 58 },
    passengers: 3,
    horsepower: 130,
    pricePerDay: 295,
    weekendPrice: 335,
    deliveryFee: 50,
    deposit: 700,
    serviceFee: 38,
    distanceKm: 15,
    rating: 4.86,
    reviews: 22,
    deliveryAvailable: true,
    cancellation: "Modérée",
    status: "active",
    host: {
      name: "Laurence Gauthier",
      avatar: "LG",
      rating: 4.9,
      responseTime: "19 min",
      verified: true,
      phone: "+1 819 555 0126",
    },
    images: [imagePool.dock, imagePool.marina, imagePool.shoreline],
    features: ["Plateforme stable", "Glacière LinQ", "Échosondeur", "Mode randonnée"],
    equipment: ["3 gilets", "Glacière", "Trousse sécurité", "Support téléphone"],
    rules: [
      "Navigation familiale uniquement",
      "Retour avec carburant au niveau initial",
      "Livraison possible à Aylmer et environs",
    ],
    description:
      "Un modèle stable et pratique pour une journée tranquille, avec rangement, glacière et confort pour trois passagers.",
    navigationZone:
      "Zone recommandée : Aylmer Marina et zones calmes de la rive gatinoise.",
  },
  {
    slug: "kawasaki-stx-160-lac-leamy",
    name: "Kawasaki STX 160 Lac Leamy",
    brand: "Kawasaki",
    model: "STX 160",
    year: 2024,
    type: "Débutant",
    location: "Lac Leamy",
    area: "Gatineau",
    coordinates: { x: 63, y: 31 },
    passengers: 3,
    horsepower: 160,
    pricePerDay: 275,
    weekendPrice: 305,
    deliveryFee: 40,
    deposit: 620,
    serviceFee: 35,
    distanceKm: 4,
    rating: 4.92,
    reviews: 29,
    deliveryAvailable: true,
    cancellation: "Flexible",
    status: "active",
    host: {
      name: "Amine Barka",
      avatar: "AB",
      rating: 4.94,
      responseTime: "14 min",
      verified: true,
      phone: "+1 819 555 0184",
    },
    images: [imagePool.lake, imagePool.hero, imagePool.dock],
    features: ["Mode confort", "Stabilité élevée", "Échelle arrière", "Rangement avant"],
    equipment: ["3 gilets", "Carte locale", "Ancre légère", "Trousse premiers soins"],
    rules: [
      "Briefing débutant inclus",
      "Respect des zones lentes",
      "Sortie annulée si vent trop fort",
    ],
    description:
      "Un excellent choix pour débuter avec un propriétaire très présent au départ et des consignes simples.",
    navigationZone:
      "Zone recommandée : Lac Leamy et départs encadrés selon la météo du jour.",
  },
  {
    slug: "sea-doo-rxp-x-chelsea-premium",
    name: "Sea-Doo RXP-X 300",
    brand: "Sea-Doo",
    model: "RXP-X 300",
    year: 2024,
    type: "Premium",
    location: "Chelsea",
    area: "Gatineau Hills",
    coordinates: { x: 74, y: 26 },
    passengers: 2,
    horsepower: 300,
    pricePerDay: 420,
    weekendPrice: 480,
    deliveryFee: 75,
    deposit: 1000,
    serviceFee: 55,
    distanceKm: 21,
    rating: 4.97,
    reviews: 16,
    deliveryAvailable: true,
    cancellation: "Stricte",
    status: "active",
    host: {
      name: "Victor Nguyen",
      avatar: "VN",
      rating: 4.99,
      responseTime: "11 min",
      verified: true,
      phone: "+1 873 555 0199",
    },
    images: [imagePool.hero, imagePool.shoreline, imagePool.river],
    features: ["300 hp", "Mode sport avancé", "Siège performance", "Frein intelligent"],
    equipment: ["2 gilets premium", "Sac étanche", "Radio VHF", "Inspection départ"],
    rules: [
      "Expérience avancée obligatoire",
      "Dépôt validé avant livraison",
      "Navigation sportive seulement en zone dégagée",
    ],
    description:
      "Une machine premium très puissante pour pilotes expérimentés qui veulent une sortie haut de gamme et encadrée.",
    navigationZone:
      "Zone recommandée : itinéraire validé avec le propriétaire selon le point de livraison.",
  },
];

export const categories = [
  {
    title: "Jet-ski sport",
    copy: "Accélération, sensations et conduite vive.",
    image: imagePool.hero,
  },
  {
    title: "Jet-ski familial",
    copy: "Stable, confortable et rassurant à plusieurs.",
    image: imagePool.dock,
  },
  {
    title: "Jet-ski premium",
    copy: "Confort, rangement et finition haut de gamme.",
    image: imagePool.shoreline,
  },
  {
    title: "Jet-ski débutant",
    copy: "Briefing inclus et prise en main facile.",
    image: imagePool.lake,
  },
];

export const bookings: Booking[] = [
  {
    id: "RW-7429",
    listingSlug: "sea-doo-gtx-170-britannia",
    listingName: "Sea-Doo GTX 170 Signature",
    dateRange: "18-19 juillet 2026",
    status: "Confirmée",
    location: "Britannia Beach",
    total: 819,
    mode: "Livraison",
  },
  {
    id: "RW-7214",
    listingSlug: "yamaha-vx-cruiser-aylmer",
    listingName: "Yamaha VX Cruiser Aylmer",
    dateRange: "Aujourd'hui, 13:00",
    status: "À venir aujourd'hui",
    location: "Aylmer Marina",
    total: 361,
    mode: "Récupération",
  },
  {
    id: "RW-6881",
    listingSlug: "sea-doo-spark-trixx-lac-leamy",
    listingName: "Sea-Doo Spark Trixx",
    dateRange: "2 juin 2026",
    status: "Terminée",
    location: "Lac Leamy",
    total: 278,
    mode: "Récupération",
  },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    host: "Maya Tremblay",
    listing: "Sea-Doo GTX 170 Signature",
    status: "Réservation confirmée",
    unread: 2,
    messages: [
      {
        from: "host",
        text: "La livraison au quai est confirmée pour 9:30. Je t'envoie le point exact demain matin.",
        time: "09:12",
      },
      {
        from: "client",
        text: "Parfait, merci. Nous aurons deux sacs étanches et trois gilets?",
        time: "09:16",
      },
      {
        from: "host",
        text: "Oui, tout est inclus. Je garde aussi un gilet enfant au cas où.",
        time: "09:18",
      },
    ],
  },
  {
    id: "c2",
    host: "Olivier Paquette",
    listing: "Yamaha VX Cruiser Aylmer",
    status: "Pré-demande",
    unread: 0,
    messages: [
      {
        from: "host",
        text: "Le créneau de samedi est disponible. Souhaites-tu une prise en main plus longue?",
        time: "Hier",
      },
      {
        from: "client",
        text: "Oui, ce serait idéal pour une première sortie à deux.",
        time: "Hier",
      },
    ],
  },
  {
    id: "c3",
    host: "Claire Morin",
    listing: "Yamaha FX HO Parc",
    status: "Question ouverte",
    unread: 1,
    messages: [
      {
        from: "host",
        text: "Je peux livrer au quai du Parc Jacques-Cartier entre 8:00 et 10:00.",
        time: "Lun",
      },
      {
        from: "client",
        text: "Super, je confirme après avoir vérifié la météo.",
        time: "Lun",
      },
    ],
  },
];

export const ownerStats = [
  { label: "Revenus du mois", value: "6 840 $", trend: "+18%" },
  { label: "Réservations", value: "27", trend: "+6" },
  { label: "Jet-skis actifs", value: "4", trend: "100%" },
  { label: "Note moyenne", value: "4.94", trend: "+0.2" },
];

export const revenueBars = [
  42, 58, 36, 70, 62, 84, 76, 92, 64, 78, 88, 96,
];

export function getListing(slug: string) {
  return listings.find((listing) => listing.slug === slug);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}
