import { err, ok, type Result } from "@/domain/errors/result";

const MAX_NOTE_TITLE_LENGTH = 80;

export type NoteTitleError = Readonly<{
  code: "empty_title" | "title_too_long";
  message: string;
}>;

export function createNoteTitle(rawTitle: string): Result<string, NoteTitleError> {
  const title = rawTitle.trim();

  if (title.length === 0) {
    return err({
      code: "empty_title",
      message: "Le titre est obligatoire."
    });
  }

  if (title.length > MAX_NOTE_TITLE_LENGTH) {
    return err({
      code: "title_too_long",
      message: `Le titre doit faire ${MAX_NOTE_TITLE_LENGTH} caracteres maximum.`
    });
  }

  return ok(title);
}
