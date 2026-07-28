import type { CreateNoteCommand, Note } from "@/domain/entities/note";
import { type Result, err, ok } from "@/domain/errors/result";

export type NotesTableRow = Readonly<{
  id: string;
  titre: string;
  contenu: string;
  cree_le: string;
}>;

export type NotesTableInsert = Readonly<{
  titre: string;
  contenu: string;
}>;

export type NoteMapperError = Readonly<{
  code: "invalid_note_row";
  message: string;
}>;

export function toNote(row: NotesTableRow): Result<Note, NoteMapperError> {
  if (!isStringFilled(row.id) || !isStringFilled(row.titre)) {
    return err({
      code: "invalid_note_row",
      message: "La base a retourne une note invalide."
    });
  }

  return ok({
    id: row.id,
    title: row.titre,
    content: row.contenu,
    createdAt: row.cree_le
  });
}

export function toNotes(rows: readonly NotesTableRow[]): Result<readonly Note[], NoteMapperError> {
  const notes: Note[] = [];

  for (const row of rows) {
    const noteResult = toNote(row);

    if (!noteResult.ok) {
      return noteResult;
    }

    notes.push(noteResult.value);
  }

  return ok(notes);
}

export function toNotesTableInsert(command: CreateNoteCommand): NotesTableInsert {
  return {
    titre: command.title,
    contenu: command.content
  };
}

function isStringFilled(value: string): boolean {
  return value.trim().length > 0;
}
