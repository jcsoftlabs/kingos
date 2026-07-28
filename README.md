# Kingo's — Site web (Vercel)

Frontend Next.js 15 (App Router) + TypeScript + Tailwind du site Kingo's. Voir le
plan d'implémentation complet dans le dépôt `kingos-plan`
(`PLAN_IMPLEMENTATION_KINGOS.md`) pour l'architecture et la feuille de route.

## Démarrage local

```bash
cp .env.example .env.local   # renseigner URL_API, etc.
pnpm install
pnpm dev
```

Ouvre `http://localhost:3000`.

## Thème

La charte graphique est dérivée directement du logo Kingo's
(`public/logo-kingos.png`) — voir `tailwind.config.ts` pour la palette complète
(marine, magenta, cyan, lime, forêt, crème) extraite par échantillonnage des
pixels du logo. Jetons sémantiques dans `app/globals.css`.

## Architecture

Le navigateur ne parle jamais directement à l'API Railway : toutes les requêtes
passent par les Route Handlers Next.js (`app/api/**`) qui agissent en BFF. Seule
exception : l'upload de fichiers va directement du navigateur vers Cloudinary,
avec une signature émise par l'API (plan §1.2, §6.2).

## État d'avancement

Scaffolding initial : thème complet, mise en page (en-tête, pied de page),
page d'accueil, structure de routes pour la vitrine, l'espace client et les
pages légales. Le contenu métier (catalogue dynamique, configurateur, espace
client, back-office) reste à connecter à l'API — voir le plan pour le détail
par phase.
