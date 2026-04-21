# Gestion des Étudiants — Plateforme Web

Une plateforme web complète de **gestion et de transparence financière** pour les étudiants, permettant de suivre les cotisations, les dépenses et d'assurer une traçabilité totale des fonds.

---

## 🎯 Objectif

Offrir aux étudiants une **vision claire et transparente** de leurs cotisations et dépenses, centralisant ainsi les informations financières et améliorant la confiance dans la gestion administrative.

---

## 🛠️ Technologies

### Frontend
- **Next.js 15.x** — Framework React moderne (App Router)
- **TypeScript** — Typage statique pour la robustesse
- **Tailwind CSS** — Design responsive et moderne
- **React 19** — Composants performants

### Backend
- **Fastify 5.x** — Serveur API ultra-rapide
- **TypeScript** — Code backend type-safe
- **JWT** — Authentification sécurisée
- **Swagger/OpenAPI** — Documentation API interactive

### Base de Données
- **Prisma 5.x** — ORM type-safe
- **PostgreSQL (Neon)** — Base relationnelle robuste

---

## 📦 Architecture

Monorepo avec **npm workspaces** :

```
my-app/
├── apps/
│   ├── web/              → Frontend Next.js (@myapp/web)
│   └── api/              → Backend Fastify (@myapp/api)
└── packages/
    └── db/               → Client Prisma partagé (@myapp/db)
```

---

## 🚀 Quick Start

### Prérequis
- Node.js 18+
- npm 9+
- PostgreSQL (ou compte Neon)

### Installation

```bash
# Cloner et installer
git clone <repo>
cd my-app
npm install

# Configurer l'environnement
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Migrations base de données
npx prisma migrate deploy
```

### Commandes

```bash
# Développement (web + API en parallèle)
npm run dev

# Développement web uniquement
npm run dev:web       # http://localhost:3000

# Développement API uniquement
npm run dev:api       # http://localhost:3001

# Build production
npm run build

# Linter le code
npm run lint

# Voir la documentation API (Swagger)
# http://localhost:3001/api-docs
```

---

## 📊 Fonctionnalités Principales

- ✅ **Authentification JWT** — Connexion sécurisée des étudiants
- ✅ **Dashboard** — Vue d'ensemble des cotisations et dépenses
- ✅ **Suivi des Transactions** — Historique détaillé et filtrable
- ✅ **Gestion des Cotisations** — Enregistrement et validation
- ✅ **Rapports & Analytics** — Synthèse des dépenses par catégorie
- ✅ **Documentation API** — Swagger UI pour tester les endpoints
- ✅ **Design Responsive** — Compatible mobile, tablette, desktop

---

## 📁 Structure du Projet

### Frontend (`apps/web/`)
```
app/
├── (auth)/              → Pages d'authentification
├── dashboard/           → Tableau de bord principal
│   ├── page.tsx        → Vue d'ensemble stats
│   ├── expenses/       → Gestion des dépenses
│   ├── benefice/       → Gestion des bénéfices
│   └── transactions/   → Historique des transactions
├── layout.tsx          → Layout racine
└── page.tsx            → Page d'accueil

components/            → Composants UI réutilisables
lib/                   → Services API, configurations
hooks/                 → Custom hooks React
```

### Backend (`apps/api/`)
```
routes/                → Endpoints API
├── auth.routes.ts     → Login, signup, logout
├── admin.routes.ts    → Gestion administrative
└── students.routes.ts → Données étudiants

services/              → Logique métier
dto/                   → Schémas de validation (Zod)
middlewares/           → Auth, compression, CORS
```

### Base de Données (`packages/db/`)
```
prisma/
├── schema.prisma      → Modèle de données
└── migrations/        → Historique des changements
```

---

## 🔐 Sécurité

- ✅ **JWT Bearer Tokens** — Authentification stateless
- ✅ **Validation Zod** — Validation stricte des inputs
- ✅ **CORS Configuré** — Restrictions d'origine HTTP
- ✅ **Compression** — Responses compressées (Gzip)
- ✅ **Argon2** — Hash sécurisé des mots de passe

---

## 📈 Performance

- Monorepo — Code partagé et optimisé
- Fastify — Serveur haute performance (~60K req/s)
- Prisma Client — Requêtes SQL optimisées
- Next.js Caching — Réduction des appels API

---

## 🛠️ Configuration Environnement

| Variable | Location | Usage |
|----------|----------|-------|
| `DATABASE_URL` | `.env` (root) | Connexion PostgreSQL (Prisma CLI) |
| `JWT_SECRETS` | `apps/api/.env` | Clé de signature des tokens JWT |
| `URL_FRONT` | `apps/api/.env` | URL frontend (CORS) |
| `URL_SWAGGER` | `apps/api/.env` | URL Swagger UI (CORS) |
| `NEXT_PUBLIC_API_URL` | `apps/web/.env.local` | Endpoint API côté frontend |

---

## 📚 API Documentation

Swagger UI disponible à : **http://localhost:3001/api-docs**

Endpoints principaux :
- `POST /auth/signin` — Connexion
- `POST /auth/signup` — Inscription
- `GET /student/pay` — Solde de l'étudiant
- `GET /transactions/me` — Mes transactions
- `GET /expense/me` — Mes dépenses
- `GET /benefice/me` — Mes bénéfices

---

## 🔄 Workflow de Développement

1. Créer une branche feature : `git checkout -b feature/ma-feature`
2. Développer et tester localement : `npm run dev`
3. Linter le code : `npm run lint`
4. Committer : `git commit -m "feat: description"`
5. Pusher et créer une Pull Request

---

## 🚀 Déploiement

### Frontend (Vercel)
```bash
# Déployer automatiquement depuis GitHub
# Configurer NEXT_PUBLIC_API_URL dans les env vars Vercel
```

### Backend (Heroku / Railway / VPS)
```bash
npm run build
npm start
# Définir DATABASE_URL, JWT_SECRETS, etc. sur la plateforme
```

---

## 📝 License

Projet personnel — Tous droits réservés.

---

## 👤 Contact & Ressources

- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Fastify** : https://www.fastify.io/docs/latest
- **Documentation Prisma** : https://www.prisma.io/docs
- **TypeScript** : https://www.typescriptlang.org

---

**Version actuelle** : 0.1.0  
**Dernière mise à jour** : Avril 2026
