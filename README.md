# RideWave

Marketplace Next.js pour la location de jet-skis à Ottawa et Gatineau.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase PostgreSQL

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`.

## Configurer Supabase

1. Créer un projet sur `https://database.new`.
2. Ouvrir le SQL Editor du projet Supabase.
3. Exécuter `supabase/01_schema.sql`.
4. Exécuter `supabase/02_seed_jet_skis.sql`.
5. Copier `.env.example` vers `.env.local`.
6. Remplir :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

RideWave lit la table `public.jet_skis`. Si Supabase n'est pas encore configuré, l'app utilise les 10 annonces locales de fallback.

## Déploiement Vercel

1. Importer le repo GitHub `yanishmk/ridewave`.
2. Choisir le framework Next.js.
3. Ajouter les mêmes variables d'environnement Supabase dans Vercel.
4. Déployer.

Commandes de validation :

```bash
npm run lint
npm run build
```

## Branches

La branche de travail actuelle est `agent/ridewave-next-app`.
