# Justification orale

## Choix techniques

L'application est faite avec Expo et React Native pour obtenir rapidement un projet mobile lancable sur simulateur, telephone ou web. Supabase est utilise comme base de donnees distante, avec une table `notes`.

## Respect du clean code

Les effets de bord sont isoles dans `src/adapters/repositories/supabaseNoteRepository.ts`. L'interface `NoteRepository` vit dans le domaine, ce qui evite que le reste de l'application depende directement de Supabase.

La validation du formulaire est faite a la frontiere presentation, avant l'appel au service. La regle de titre non vide et limite a 80 caracteres est centralisee dans le value object `noteTitle`.

Le service `createNoteService` orchestre les cas d'utilisation sans connaitre React Native, la navigation ou Supabase. Les dependances concretes sont branchees dans `src/main/createAppDependencies.ts`.

## Points du bareme

- Lecture : `listNotes` appelle le repository Supabase et l'ecran affiche le resultat en `FlatList`.
- Insertion : le formulaire cree une note puis recharge la liste.
- Detail : l'ecran liste passe la note selectionnee en parametre de navigation.
- Etats : chargement, erreur, liste vide et creation en cours sont affiches explicitement.
