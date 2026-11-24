# Jeek Store — Customer Website

Standalone storefront (React + Vite + Firebase Firestore). It has **no link or code** for the admin panel,
which is a separate project/site.

## 1. Firebase (once, shared with the admin site)
1. Create a project at https://console.firebase.google.com
2. Build → **Firestore Database** → Create database (production mode).
3. Firestore → **Rules** → paste the contents of `firestore.rules` → Publish.
4. Build → **Authentication** → Sign-in method → enable **Google** (customers can sign in with Google, but can also order as guests).
   Then Settings → Authorized domains → add your store domain (e.g. `youruser.github.io`).
5. Project settings → Your apps → add a **Web app** → copy the config values.

## 2. Run locally
```bash
cp .env.example .env     # fill in the VITE_FIREBASE_* values
npm install
npm run dev
```

## 3. Deploy on GitHub Pages
1. Push this folder to a GitHub repository (branch `main`).
2. Repo → Settings → **Pages** → Source: **GitHub Actions**.
3. Repo → Settings → Secrets and variables → Actions → add one secret per value in `.env.example`
   (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`).
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes the site.

Any static host (Netlify, Vercel, Cloudflare Pages, Firebase Hosting) also works: build command
`npm run build`, output folder `dist`.
