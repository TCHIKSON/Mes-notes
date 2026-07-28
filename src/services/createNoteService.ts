import type { CreateNoteCommand, Note } from "@/domain/entities/note";
import type { Result } from "@/domain/errors/result";
import type {
  NoteRepository,
  NoteRepositoryError,
} from "@/domain/ports/noteRepository";

export type NoteService = Readonly<{
  listNotes: () => Promise<Result<readonly Note[], NoteRepositoryError>>;
  createNote: (
    command: CreateNoteCommand,
  ) => Promise<Result<Note, NoteRepositoryError>>;
  updateNote: (
    id: string,
    command: CreateNoteCommand,
  ) => Promise<Result<Note, NoteRepositoryError>>;
  deleteNote: (id: string) => Promise<Result<Note, NoteRepositoryError>>;
}>;

export function createNoteService(repository: NoteRepository): NoteService {
  return {
    listNotes: () => repository.findAll(),
    createNote: (command) => repository.create(command),
    updateNote: (id, command) => repository.update(id, command),
    deleteNote: (id) => repository.delete(id),
  };
}
