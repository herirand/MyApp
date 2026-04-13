# Configuration et Déploiement - Frontend

## Variables d'Environnement

### `.env.local` (Développement)

```env
# API Backend URL
# Cette variable est utilisée dans TOUS les appels fetch du frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Configuration pour le Déploiement

#### 1. Développement Local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 2. Staging/Pré-production
```env
NEXT_PUBLIC_API_URL=https://api-staging.example.com
```

#### 3. Production
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 🚀 Guide de Déploiement

### Vercel (Recommandé pour Next.js)

1. **Connecter le repository**
   - Allez sur https://vercel.com
   - Importez votre repository GitHub

2. **Configurer les Variables d'Environnement**
   - Settings → Environment Variables
   - Ajouter: `NEXT_PUBLIC_API_URL` = `https://votre-api.com`

3. **Déployer**
   ```bash
   # Automatic deployment on push to main
   git push origin main
   ```

### Docker

```dockerfile
# Dockerfile exemple pour Next.js
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/.next .next
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/public public

ENV NEXT_PUBLIC_API_URL=https://api.example.com
EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[env.production]
  NEXT_PUBLIC_API_URL = "https://api.example.com"

[env.staging]
  NEXT_PUBLIC_API_URL = "https://api-staging.example.com"
```

### Self-Hosted (VPS)

```bash
# SSH sur votre serveur
ssh user@server.com

# Clone du repository
git clone <your-repo>
cd my-app/apps/web

# Installation
npm install

# Créer .env.local avec votre API URL
echo "NEXT_PUBLIC_API_URL=https://votre-api.com" > .env.local

# Build
npm run build

# Démarrer en production
npm run start
```

---

## 📋 Checklist pour le Déploiement

- [ ] Vérifier `NEXT_PUBLIC_API_URL` est configurée
- [ ] Vérifier le backend est accessible depuis le domaine du frontend
- [ ] Configurer CORS sur le backend si sur des domaines différents
- [ ] Tester les appels API en production
- [ ] Vérifier les routes sont bien configurées
- [ ] Tester l'authentification JWT

---

## 🔍 Où sont utilisées les URLs API?

Les URLs API sont utilisées dans les fichiers suivants:

### Pages de Connexion/Inscription
- `/login` → `POST /auth/signin`
- `/signup` → `POST /auth/signup`

### Dashboard Étudiant
- `/dashboard` → GET `/transactions/me`, GET `/expense/me`, GET `/pay`, GET `/benefice/me`
- `/dashboard/expenses` → GET `/expense/me`
- `/dashboard/benefice` → GET `/benefice/me`
- `/dashboard/change-password` → POST `/newPassword`

### Admin
- `/admin` → POST `/transactions`, POST `/expense`, POST `/benefice`
- `/admin/expenses` → POST `/expense`
- `/admin/benefice` → POST `/benefice`
- `/admin/student` → GET `/student`
- `/admin/student/manage` → POST `/create`, GET `/student`
- `/admin/student/delete` → POST `/delete`, GET `/student`
- `/admin/change-password` → POST `/newPassword`

---

## ✅ Vérification de l'Implémentation

**Tous les appels fetch utilisent `process.env.NEXT_PUBLIC_API_URL` :**

```typescript
// ✅ Correct - Utilise la variable d'environnement
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
  method: 'POST',
  // ...
});

// ❌ Incorrect - URL hardcodée
const response = await fetch('http://localhost:3001/auth/signin', {
  method: 'POST',
  // ...
});
```

---

## 🔗 CORS (Cross-Origin Resource Sharing)

Si votre frontend et backend sont sur des domaines différents, configurez CORS sur le backend:

**Backend (Fastify)**
```typescript
app.register(fastifyCors, {
  origin: ['https://votre-domaine.com', 'https://www.votre-domaine.com'],
  credentials: true,
});
```

---

## 📝 Notes Important

1. **NEXT_PUBLIC_ est OBLIGATOIRE**: Sans ce préfixe, la variable n'est pas accessible côté client
2. **Sans trailing slash**: `https://api.example.com` et non `https://api.example.com/`
3. **HTTPS en production**: Utilisez toujours HTTPS pour l'API en production
4. **Variables locales**: Ne committez pas `.env.local`, utilisez `.env.example` comme template

