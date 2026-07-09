# Supabase RideWave

Exécuter ces fichiers dans le SQL Editor Supabase, dans cet ordre :

1. `01_schema.sql`
2. `02_seed_jet_skis.sql`

Le schéma crée une table publique `jet_skis`, active Row Level Security et autorise seulement la lecture publique des annonces avec `status = 'active'`.

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
