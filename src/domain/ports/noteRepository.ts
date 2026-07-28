import type { CreateNoteCommand, Note } from "@/domain/entities/note";
import type { Result } from "@/domain/errors/result";

export type NoteRepositoryError = Readonly<{
  code: "storage_unavailable" | "storage_payload_invalid";
  message: string;
  cause?: unknown;
}>;

export type NoteRepository = Readonly<{
  findAll: () => Promise<Result<readonly Note[], NoteRepositoryError>>;
  create: (
    command: CreateNoteCommand,
  ) => Promise<Result<Note, NoteRepositoryError>>;
  update: (
    id: string,
    command: CreateNoteCommand,
  ) => Promise<Result<Note, NoteRepositoryError>>;
  delete: (id: string) => Promise<Result<Note, NoteRepositoryError>>;
}>;
