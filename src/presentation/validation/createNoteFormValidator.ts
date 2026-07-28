import type { CreateNoteCommand } from "@/domain/entities/note";
import { type Result, err, ok } from "@/domain/errors/result";
import { createInitialNoteContent } from "@/domain/transform/createInitialNoteContent";
import { createNoteTitle } from "@/domain/value-objects/noteTitle";

export type CreateNoteFormInput = Readonly<{
  title: string;
}>;

export type CreateNoteFormError = Readonly<{
  code: "invalid_title";
  message: string;
}>;

export function validateCreateNoteForm(
  input: CreateNoteFormInput
): Result<CreateNoteCommand, CreateNoteFormError> {
  const titleResult = createNoteTitle(input.title);

  if (!titleResult.ok) {
    return err({
      code: "invalid_title",
      message: titleResult.error.message
    });
  }

  return ok({
    title: titleResult.value,
    content: createInitialNoteContent(titleResult.value)
  });
}
