# 🏥 Dashboard de Classification Médicale

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)


## 📋 Description

Application web de tableau de bord dédié à la **classification et au monitoring d'emails médicaux**. Elle offre une interface moderne permettant de visualiser des KPIs, analyser des données, gérer la conformité et classifier automatiquement des emails dans un contexte médical.

## ✨ Fonctionnalités

- 📊 **Dashboard** — Vue d'ensemble avec KPIs et statistiques en temps réel
- 📧 **Emails** — Gestion et consultation des emails médicaux
- 🏷️ **Classification** — Catégorisation automatique des emails
- 📈 **Analytics** — Visualisations et graphiques détaillés (Recharts)
- ✅ **Conformité** — Suivi de la conformité réglementaire
- ⚙️ **Paramètres** — Configuration de l'application

## 🛠️ Technologies

| Catégorie | Technologies |
|-----------|-------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v4, CSS Custom Properties |
| UI Components | shadcn/ui, Radix UI, Material-UI |
| Charts | Recharts |
| Icons | Lucide React, MUI Icons |
| Date | date-fns |

## 🚀 Installation & Démarrage

### Prérequis

- [Node.js](https://nodejs.org/) >= 16.0.0
- [npm](https://www.npmjs.com/) >= 8.0.0

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/d-vale/LPV_dashboard_mail.git

# Accéder au répertoire
cd LPV_dashboard_mail

# Installer les dépendances
npm install
```

### Lancer le projet

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/        # Composants métier (KPI cards, charts, modals...)
│   │   └── ui/            # Composants shadcn/ui (Radix UI)
│   ├── data/              # Données mock
│   └── App.tsx            # Routing via useState (Dashboard, Emails, Classification...)
├── styles/
│   └── theme.css          # Design tokens CSS (--color-lpv-*)
└── main.tsx
```

## 🎨 Design System

Les couleurs de marque sont définies en tant que variables CSS dans `src/styles/theme.css` :

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-lpv-green` | `#449850` | Couleur principale |
| `--color-lpv-dark` | `#1B1B2F` | Fond de la sidebar |
| `--color-lpv-red` | — | Alertes / erreurs |
| `--color-lpv-blue` | — | Informations |
| `--color-lpv-amber` | — | Avertissements |
| `--color-lpv-purple` | — | Statistiques |

## 📄 Licence

Ce projet est sous licence **MIT**.
