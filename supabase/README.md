# Supabase RideWave

Exécuter ces fichiers dans le SQL Editor Supabase, dans cet ordre :

1. `01_schema.sql`
2. `02_seed_jet_skis.sql`

Le schéma crée :

- `jet_skis` pour les annonces publiques.
- `profiles` pour les comptes client/propriétaire.
- `rental_requests` pour les vraies demandes envoyées par les clients.
- `favorites` pour les favoris d'un utilisateur connecté.
- `conversations` et `messages` pour la messagerie.

Row Level Security est activé sur toutes les tables privées. Un visiteur non connecté peut seulement lire les annonces actives.

Le seed ajoute 10 annonces exemples :

- Sea-Doo GTX 170 Signature
- Yamaha VX Cruiser Aylmer
- Sea-Doo Spark Trixx
- Kawasaki Ultra LX Chelsea
- Yamaha FX HO Parc
- Sea-Doo Wake Pro 230
- Yamaha SuperJet Compact
- Sea-Doo FishPro Scout
- Kawasaki STX 160 Lac Leamy
- Sea-Doo RXP-X 300

Variables à mettre dans `.env.local` en local et dans Vercel en production :

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Ne pas mettre la clé `service_role` dans le frontend ou dans les variables publiques.
