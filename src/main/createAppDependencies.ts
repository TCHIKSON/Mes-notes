import { type Result, err, ok } from "@/domain/errors/result";
import { readSupabaseConfig, type SupabaseConfigError } from "@/config/readSupabaseConfig";
import {
  createSupabaseClientFromConfig,
  createSupabaseNoteRepository
} from "@/adapters/repositories/supabaseNoteRepository";
import { createNoteService, type NoteService } from "@/services/createNoteService";

export type AppDependencies = Readonly<{
  noteService: NoteService;
}>;

export function createAppDependencies(): Result<AppDependencies, SupabaseConfigError> {
  const configResult = readSupabaseConfig();

  if (!configResult.ok) {
    return err(configResult.error);
  }

  const client = createSupabaseClientFromConfig(configResult.value);
  const noteRepository = createSupabaseNoteRepository(client);

  return ok({
    noteService: createNoteService(noteRepository)
  });
}
