apps/web/
├── app/
│   ├── (main)/                 # Groupe de routes principal (ex: pages publiques)
│   │   ├── layout.tsx          # Layout avec Navbar/Footer public
│   │   └── page.tsx            # Page d'accueil (Home)
│   ├── (dashboard)/            # Autre groupe (ex: espace utilisateur connecté)
│   │   ├── layout.tsx          # Layout avec Sidebar
│   │   └── page.tsx            # Tableau de bord
│   ├── components/             # Composants réutilisables
│   │   ├── layout/             # Header, Footer, Sidebar...
│   │   └── ui/                 # Boutons, Inputs, Modals (idéalement générés par shadcn/ui)
│   ├── lib/                    # Fonctions utilitaires et configuration
│   │   ├── api.ts              # Configuration de l'appel vers votre backend
│   │   └── utils.ts            # Fonctions de formatage (dates, monnaie, etc.)
│   ├── types/                  # Définitions TypeScript (si vous ne faites pas un package partagé)
│   ├── globals.css             # Fichier CSS global (Tailwind)
│   └── layout.tsx              # Root Layout (le <html> et <body> de toute l'app)
