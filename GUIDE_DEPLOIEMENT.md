# 🚀 Guide de Déploiement — EcoVert Mada
**Backend → Render** | **Frontend → Vercel** | **DB → PostgreSQL existante**

---

## 📋 AVANT DE COMMENCER

Vous avez besoin de :
- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Render](https://render.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Votre `DATABASE_URL` PostgreSQL (format : `postgresql://user:password@host:5432/dbname`)

---

## ÉTAPE 1 — Pousser le code sur GitHub

### 1.1 Créer deux dépôts GitHub
Allez sur https://github.com/new et créez :
- `ecosystemvert-server` (privé ou public)
- `ecosystemvert-client` (privé ou public)

### 1.2 Backend — initialiser et pousser
```bash
cd EcoSystemVertServer
git init
git add .
git commit -m "feat: initial deploy with quotes module"
git remote add origin https://github.com/VOTRE_USERNAME/ecosystemvert-server.git
git push -u origin main
```

### 1.3 Frontend — initialiser et pousser
```bash
cd EcosystemVertClient
git init
git add .
git commit -m "feat: initial deploy with quotes frontend"
git remote add origin https://github.com/VOTRE_USERNAME/ecosystemvert-client.git
git push -u origin main
```

> ⚠️ Ne commitez JAMAIS le fichier `.env` — il est dans `.gitignore`

---

## ÉTAPE 2 — Déployer le Backend sur Render

### 2.1 Créer le service
1. Allez sur https://render.com → **New** → **Web Service**
2. Connectez votre compte GitHub si ce n'est pas fait
3. Sélectionnez le repo `ecosystemvert-server`
4. Configurez :

| Champ | Valeur |
|-------|--------|
| **Name** | `ecosystemvert-backend` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npx prisma migrate deploy && node dist/server.js` |
| **Plan** | `Free` |

### 2.2 Ajouter les variables d'environnement
Dans l'onglet **Environment** de Render, ajoutez ces variables :

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` ← **votre vraie DB** |
| `JWT_SECRET` | Cliquez **Generate** ou mettez une chaîne aléatoire longue |
| `JWT_REFRESH_SECRET` | Cliquez **Generate** ou mettez une autre chaîne aléatoire |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `https://VOTRE-APP.vercel.app` ← à compléter à l'étape 3 |

> 💡 Pour générer un secret fort : `openssl rand -base64 64`

### 2.3 Lancer le déploiement
Cliquez **Create Web Service**. Le build prend 3-5 minutes.

### 2.4 Vérifier que ça marche
Une fois déployé, testez :
```
https://ecosystemvert-backend.onrender.com/health
```
Vous devez voir : `{"status":"ok","message":"API is healthy"}`

### 2.5 Copier l'URL du backend
Notez l'URL Render, ex: `https://ecosystemvert-backend.onrender.com`
Vous en aurez besoin pour le frontend.

---

## ÉTAPE 3 — Déployer le Frontend sur Vercel

### 3.1 Mettre à jour l'URL du backend
Avant de déployer, modifiez le fichier `EcosystemVertClient/.env.production` :
```env
VITE_API_URL=https://ecosystemvert-backend.onrender.com
```
Puis commitez et poussez :
```bash
cd EcosystemVertClient
# Editez .env.production avec la vraie URL Render
git add .env.production
git commit -m "chore: set production API URL"
git push
```

> ⚠️ `.env.production` n'est PAS dans le `.gitignore` du client — c'est intentionnel pour Vercel.

### 3.2 Créer le projet Vercel
1. Allez sur https://vercel.com → **Add New Project**
2. Importez le repo `ecosystemvert-client`
3. Configurez :

| Champ | Valeur |
|-------|--------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `.` (laisser par défaut) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.3 Ajouter la variable d'environnement dans Vercel
Dans **Settings → Environment Variables** :

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://ecosystemvert-backend.onrender.com` |

> Cochez les 3 environnements : Production, Preview, Development

### 3.4 Déployer
Cliquez **Deploy**. Le build prend 1-2 minutes.

---

## ÉTAPE 4 — Mettre à jour le CORS sur Render

Maintenant que Vercel vous a donné une URL (ex: `https://ecosystemvert-client.vercel.app`) :

1. Retournez dans Render → votre service → **Environment**
2. Mettez à jour `CORS_ORIGIN` avec l'URL Vercel exacte :
   ```
   CORS_ORIGIN=https://ecosystemvert-client.vercel.app
   ```
3. Render redéploie automatiquement

---

## ÉTAPE 5 — Migration de la base de données

La commande de démarrage `npx prisma migrate deploy` s'exécute automatiquement à chaque déploiement et applique les migrations manquantes (y compris la migration des devis).

Si vous voulez vérifier manuellement :
```bash
# En local, avec la DATABASE_URL de prod dans .env
npx prisma migrate deploy
```

---

## ✅ Checklist finale

- [ ] Backend accessible : `https://xxx.onrender.com/health`
- [ ] Frontend accessible : `https://xxx.vercel.app`
- [ ] Connexion / inscription fonctionnelle
- [ ] Produits affichés
- [ ] Module Devis accessible sur `/devis`
- [ ] Admin panel accessible sur `/admin`

---

## 🔧 Problèmes fréquents

### "Application error" sur Render au démarrage
→ Vérifiez les logs Render. Souvent : `DATABASE_URL` manquante ou mauvais format.

### "CORS error" dans le navigateur
→ `CORS_ORIGIN` dans Render doit être l'URL Vercel **exacte**, sans `/` à la fin.

### 403 sur les routes admin
→ Normal si vous testez avec un compte `client`. Créez un compte avec le rôle `admin` via Prisma Studio ou le seed.

### Le frontend affiche "Cannot GET /"
→ Vérifiez que `vercel.json` est bien présent et commité dans le repo.

### Render "spins down" après inactivité (plan gratuit)
→ Le premier appel après inactivité prend 30-60 secondes. Normal sur le plan Free.
→ Solution : utiliser [UptimeRobot](https://uptimerobot.com) (gratuit) pour ping `/health` toutes les 5 minutes.

---

## 🌍 URLs finales attendues

| Service | URL |
|---------|-----|
| Backend API | `https://ecosystemvert-backend.onrender.com` |
| Frontend | `https://ecosystemvert-client.vercel.app` |
| Health check | `https://ecosystemvert-backend.onrender.com/health` |
| API Devis | `https://ecosystemvert-backend.onrender.com/quotes/price-floors` |
