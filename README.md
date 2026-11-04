# Portfolio — style pixel / code

Le code du site (Vite + React + Tailwind). Vos photos se rangent dans le
dossier `images/`, à côté de ce dossier `site/`.

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
| Photos de l'accueil, du portrait et des avis | dossier `images/` (à côté de `site/`), puis `node scripts/prepare-images.mjs` |
| Projets du portfolio | l'artefact « Projets du portfolio » sur claude.ai, bouton « Publier sur le site » |
| Cible de publication (`git` = GitHub + Vercel, `local`, `hostinger`) | `deploy.config.json` |

Les projets ne se modifient jamais à la main dans `src/data/projects.json` :
ce fichier est régénéré à chaque publication depuis l'artefact.

## Mise en ligne (GitHub + Vercel)

Le site en ligne est construit par Vercel à partir du dépôt GitHub
`Nabilmh-oss/portfolio`. Chaque `git push` sur `main` remet le site à jour
automatiquement (environ 1 minute).

### Une seule fois : envoyer le code sur GitHub

Dans le Terminal :

```bash
cd ~/Desktop/portfolio/nabil-mohamed-hagos/site
git init -b main
git add .
git commit -m "Portfolio : première version"
git remote add origin https://github.com/Nabilmh-oss/portfolio.git
git push -u origin main
```

### Une seule fois : brancher Vercel

1. Se connecter sur vercel.com avec GitHub.
2. « Add New… → Project », importer `Nabilmh-oss/portfolio`.
3. Vercel détecte Vite tout seul (build `npm run build`, dossier `dist`) → « Deploy ».
4. Copier l'adresse obtenue (par ex. `https://xxx.vercel.app`) dans `siteUrl`
   de `deploy.config.json`.

### Ajouter ou modifier un projet ensuite

1. Éditer le projet dans l'artefact « Projets du portfolio ».
2. Cliquer « Publier sur le site ».
3. Claude met à jour les données, vérifie le build puis lance
   `node scripts/apply-projects.mjs push` : seuls les projets et leurs images
   sont envoyés sur GitHub, et Vercel met le site en ligne.

Pour une modification du code ou des textes (`src/data/site.ts`…), faire un
commit et un `git push` comme d'habitude : Vercel redéploie de la même façon.
