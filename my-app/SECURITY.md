# Rapport de Sécurité - Vulnérabilités NPM

## Résumé
- **2 vulnérabilités trouvées** (1 critique, 1 haute)
- **Date du scan**: 2025-04-15
- **Solutions disponibles**: Oui

---

## Vulnérabilité 1: `fast-jwt` - CRITIQUE ⚠️

### Détails
- **Package**: `fast-jwt` v6.1.0
- **Severity**: CRITIQUE (5 CVE différentes)
- **Dépendance via**: `@fastify/jwt@10.0.0` → `fast-jwt`
- **Impact**: Authentification JWT compromise
  - Accepte des en-têtes JWT invalides (RFC 7515 violation)
  - Confusion d'algorithme JWT
  - Mélange des claims entre tokens différents (CVSS: 9.1)
  - Attaques par regex (ReDoS)

### Solution 1: Appliquer le fix automatique (RECOMMANDÉ)
```bash
npm audit fix
```
Cela mettra à jour:
- `@fastify/jwt@10.0.0` → reste à 10.0.0 (sans changement)
- `fast-jwt@6.1.0` → `fast-jwt@6.2.1` (version corrigée)

**Avantages**: Simple, une commande
**Temps**: < 1 minute

### Solution 2: Mise à jour manuelle
Si `npm audit fix` ne suffit pas:

```bash
# Mettre à jour fast-jwt directement
npm install fast-jwt@^6.2.1 --save

# Ou via @fastify/jwt avec une version plus récente
npm install @fastify/jwt@latest
```

### Vérification après fix
```bash
npm audit
# Devrait afficher: 1 vulnerability (1 high) - seulement Next.js reste

npm ls fast-jwt
# fast-jwt@6.2.1 (ou plus récent)
```

---

## Vulnérabilité 2: `next` - HAUTE 🔴

### Détails
- **Package**: `next` (versions affectées)
  - `next@16.2.1` (root) - vulnérable
  - `next@15.5.14` (apps/web) - vulnérable
- **Severity**: HAUTE
- **Impact**: Denial of Service (DoS) avec Server Components
  - CVSS Score: 7.5
  - Permet l'épuisement des ressources serveur

### Solution 1: Upgrade simple (RECOMMANDÉ)
```bash
# Racine
npm install next@16.2.3

# Ou via le workspace
npm install next@16.2.3 -w @myapp/web
```

**Versions sûres**:
- `next@16.2.3` ou `16.x` plus récent (évite le bug)
- `next@15.5.15` ou `15.x` plus récent

### Solution 2: Via npm audit fix
```bash
npm audit fix
```
Cela mettra à jour Next.js à une version sûre.

### Vérification
```bash
npm ls next
# Doit afficher:
# ├── next@16.2.3 (ou plus récent)
# └─┬ @myapp/web
#   └── next@15.5.15 (ou plus récent)

npm audit
# Devrait afficher: up to date
```

---

## Plan d'Action Complet

### Étape 1: Appliquer le fix automatique (5 minutes)
```bash
cd /home/herirand/42cursus/DEMO/MyApp/my-app

# Voir ce que ça va faire
npm audit fix --dry-run

# Appliquer les fixes
npm audit fix
```

### Étape 2: Vérifier les résultats
```bash
# Vérifier qu'il n'y a plus de vulnérabilités
npm audit

# Vérifier que l'app fonctionne toujours
npm run dev
```

### Étape 3: Tester l'authentification JWT
```bash
# S'assurer que les endpoints d'auth fonctionnent:
# POST /auth/signin
# POST /auth/signup
# Les tokens JWT doivent être valides et sécurisés
```

### Étape 4: Vérifier les performances
Après les upgrades, s'assurer que:
- [ ] `npm run dev` démarre sans erreurs
- [ ] Le frontend charge correctement
- [ ] L'API répond aux requêtes
- [ ] L'authentification fonctionne

### Étape 5: Committer les changements
```bash
git add package.json package-lock.json
git commit -m "fix: resolve npm audit vulnerabilities (fast-jwt, next)"
git push
```

---

## Important: Configuration de Sécurité JWT à Réviser

Après les fixes, **IMPORTANT**: Ta clé JWT est hardcodée en développement:

**apps/api/server.ts:28**
```typescript
app.register(fastifyJwt, {
  secret: "fastifyjwtpass"  // ⚠️ HARDCODED - DANGER EN PRODUCTION
})
```

### Pour la production:
```typescript
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRETS || "changez_ceci_en_production"
})
```

Et dans `/apps/api/.env`:
```env
JWT_SECRETS=votre_cle_secrete_longue_et_aleatoire_ici
```

**Générer une clé sûre**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Suivi des Vulnérabilités Futures

### Vérifier régulièrement:
```bash
npm audit
```

### Mettre à jour les dépendances:
```bash
npm update
```

### Audit automatisé (ci/cd recommandé):
Ajoute à ton workflow GitHub Actions:
```yaml
- name: npm audit
  run: npm audit --audit-level=moderate
```

---

## Références

- **fast-jwt**: https://github.com/fastify/fast-jwt/releases
- **Next.js Security**: https://nextjs.org/security
- **NPM Audit**: https://docs.npmjs.com/cli/v9/commands/npm-audit
- **JWT Best Practices**: https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/

---

## Conclusion

✅ Les 2 vulnérabilités peuvent être **fixées en 5 minutes** avec `npm audit fix`

⚠️ Après le fix, **révise la configuration JWT** et utilise des clés sécurisées en production
