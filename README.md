# BlaBlaCar Mini

Application de covoiturage pédagogique développée dans le cadre du cours **Framework Web 2**.

---

## Présentation

BlaBlaCar Mini est une application web de covoiturage permettant à des utilisateurs authentifiés de publier, rechercher et réserver des trajets. Elle intègre également une fonctionnalité météo sur la page de détail d'un trajet.

Le projet a été réalisé avec **Vue 3 + Vite + Pinia + Firebase**.

---

## Fonctionnalités

- **Authentification** — Inscription, connexion et déconnexion via Firebase Auth
- **Publication de trajets** — Création d'un trajet avec date, heure, nombre de places et prix
- **Recherche & filtres** — Recherche de trajets avec filtres réutilisables et réinitialisation
- **Réservation** — Création d'une réservation, gestion des doublons et décrémentation des places disponibles
- **Espace personnel** — Pages _Mes trajets_, _Mes réservations_ et _Profil_ (édition des informations)
- **Météo** — Affichage des conditions météo sur la page de détail d'un trajet (OpenWeather + fallback Open-Meteo)
- **Contact** — Formulaire rapide enregistrant les messages dans Firestore

---

## Stack technique

Le projet utilise Vue 3 (Composition API) comme framework principal, construit avec Vite. La gestion
d'état est assurée par Pinia et le routage par Vue Router avec lazy-loading des vues et guards
d'authentification. Le backend et la persistance sont fournis par Firebase (Auth + Firestore). Pour
les données météo nous utilisons OpenWeather (clé optionnelle) avec Open-Meteo en fallback lorsque
OpenWeather est indisponible ou sans clé.

---

## APIs utilisées

- **[OpenWeather](https://openweathermap.org/api)** _(optionnel)_ — Données météo par ville. Nécessite une clé API renseignée dans `.env`.
- **[Open-Meteo](https://open-meteo.com/)** _(fallback)_ — Utilisé automatiquement si OpenWeather est indisponible ou si aucune clé n'est fournie. Aucune clé requise.

---

## Installation

**Prérequis :** Node.js >= 18, npm

```bash
# 1. Cloner le dépôt
git clone <lien-du-dépôt>
cd blablacar

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Ouvrir .env et renseigner VITE_OPENWEATHER_API_KEY (optionnel)

# 4. Lancer en mode développement
npm run dev

# 5. Build de production
npm run build
```

**Note :** L'application fonctionne sans clé OpenWeather. Dans ce cas, la météo est fournie automatiquement par Open-Meteo.

---

## Difficultés rencontrées

Pendant le développement, on a rencontré plusieurs difficultés :

- **Erreurs météo** — L'API OpenWeather retourne des erreurs 401 quand la clé est invalide ou que le quota est dépassé. On a mis en place un fallback automatique vers Open-Meteo pour que la météo s'affiche quand même, avec un message clair pour l'utilisateur.

- **Doublons de réservation** — Sans vérification, un utilisateur pouvait réserver deux fois le même trajet. On vérifie maintenant côté client avant de créer la réservation.

- **Gestion des dates** — L'affichage des dates était incohérent selon les navigateurs. On a uniformisé le parsing et l'affichage avec `toLocaleDateString` dans les composants concernés.

- **Accessibilité** — Après plusieurs itérations sur le design, certains éléments décoratifs n'étaient pas accessibles. On a ajouté des attributs `aria-hidden` et revu les media queries pour corriger ça.

---

## Équipe et répartition

On a travaillé en binôme sur ce projet. Léo Degrugillier s'est principalement chargé de tout ce qui touche
au backend : l'architecture Firebase, les stores Pinia, la logique de réservation et les guards
d'authentification. Léo Roussel-Cousin s'est occupé de la partie visible : l'interface, les composants
réutilisables, l'intégration météo et la documentation.

## Mise en ligne du site

Le site a été mit en ligne, voici le lien: https://blablacar-seven.vercel.app/

---

## Auteurs

Léo Degrugillier & Léo Roussel-Cousin - Projet réalisé dans le cadre du cours Framework Web 2.
