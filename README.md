# Portfolio — Nabil Mohamed Hagos

Le code du site (Vite + React + Tailwind) : une page d'accueil et une page
« À propos » (`/a-propos/`).

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173

## Où modifier quoi

| Quoi | Où |
|---|---|
| Textes, coordonnées, couleur d'accent | `src/data/site.ts` |
| Photos de l'accueil et du portrait | dossier `images/` (à côté de `site/`), puis `node scripts/prepare-images.mjs` |
| Projets (textes, images) | `src/data/projects.json` et `public/projects/assets/` |
| Mockups MacBook / iPhone des projets | `src/data/mockups.ts` et `public/mockups/` |
| Style des boutons | `src/components/ui/pixel-button.tsx` |

## Mise en ligne (GitHub + Vercel)

Le site en ligne est construit par Vercel à partir du dépôt GitHub
`Nabilmh-oss/portfolio`. Chaque `git push` sur `main` remet le site à jour
automatiquement (environ 1 minute).

Vercel détecte Vite tout seul : build `npm run build`, dossier `dist`.
