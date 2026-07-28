# Mes notes

Mini-application React Native de prise de notes avec Supabase.

## Lancement

```bash
npm install
npm start
```

Copiez `.env.example` en `.env` puis renseignez :

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

## Base de donnees

Le script SQL se trouve dans [supabase/schema.sql](supabase/schema.sql). Il cree une table `notes` avec les colonnes demandees : `id`, `titre`, `contenu`, `cree_le`.

## Fonctionnalites

- Liste des notes depuis Supabase dans une `FlatList`.
- Ajout par titre, insertion en base, puis rafraichissement.
- Ecran detail avec navigation et passage de la note en parametre.
- Etats de chargement, erreur et liste vide.

## Architecture

Le code suit la consigne clean-code du depot :

- `src/domain` : entites, value objects, ports et resultats types.
- `src/services` : cas d'utilisation applicatifs.
- `src/adapters` : acces Supabase isole derriere le port `NoteRepository`.
- `src/presentation` : ecrans, navigation, composants et validation de formulaire.
- `src/main` : composition root et injection des dependances.
