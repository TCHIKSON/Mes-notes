const INITIAL_CONTENT_PREFIX = "Contenu initial de la note";

export function createInitialNoteContent(title: string): string {
  return `${INITIAL_CONTENT_PREFIX} : ${title}`;
}
