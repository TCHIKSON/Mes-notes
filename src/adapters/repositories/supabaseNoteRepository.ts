import "react-native-url-polyfill/auto";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  NoteRepository,
  NoteRepositoryError,
} from "@/domain/ports/noteRepository";
import { err, ok } from "@/domain/errors/result";
import type { NotesTableInsert, NotesTableRow } from "@/mappers/noteMapper";
import { toNote, toNotes, toNotesTableInsert } from "@/mappers/noteMapper";
import type { SupabaseConfig } from "@/config/readSupabaseConfig";

const NOTES_TABLE = "notes";
const NOTES_COLUMNS = "id,titre,contenu,cree_le";

type Database = {
  public: {
    Tables: {
      notes: {
        Row: NotesTableRow;
        Insert: NotesTableInsert;
        Update: Partial<NotesTableInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

export function createSupabaseClientFromConfig(
  config: SupabaseConfig,
): SupabaseClient<Database> {
  return createClient<Database>(config.url, config.anonKey);
}

export function createSupabaseNoteRepository(
  client: SupabaseClient<Database>,
): NoteRepository {
  return {
    findAll: async () => {
      const response = await client
        .from(NOTES_TABLE)
        .select(NOTES_COLUMNS)
        .order("cree_le", { ascending: false });

      if (response.error) {
        return err(toStorageError(response.error.message, response.error));
      }

      const notesResult = toNotes(response.data ?? []);
      return notesResult.ok
        ? ok(notesResult.value)
        : err(toPayloadError(notesResult.error));
    },
    create: async (command) => {
      const response = await client
        .from(NOTES_TABLE)
        .insert(toNotesTableInsert(command))
        .select(NOTES_COLUMNS)
        .single();

      if (response.error) {
        return err(toStorageError(response.error.message, response.error));
      }

      const noteResult = toNote(response.data);
      return noteResult.ok
        ? ok(noteResult.value)
        : err(toPayloadError(noteResult.error));
    },
    update: async (id, command) => {
      const response = await client
        .from(NOTES_TABLE)
        .update(toNotesTableInsert(command))
        .eq("id", id)
        .select(NOTES_COLUMNS)
        .single();

      if (response.error) {
        return err(toStorageError(response.error.message, response.error));
      }

      const noteResult = toNote(response.data);
      return noteResult.ok
        ? ok(noteResult.value)
        : err(toPayloadError(noteResult.error));
    },
    delete: async (id) => {
      const response = await client
        .from(NOTES_TABLE)
        .delete()
        .eq("id", id)
        .select(NOTES_COLUMNS)
        .single();

      if (response.error) {
        return err(toStorageError(response.error.message, response.error));
      }

      const noteResult = toNote(response.data);
      return noteResult.ok
        ? ok(noteResult.value)
        : err(toPayloadError(noteResult.error));
    },
  };
}

function toStorageError(message: string, cause: unknown): NoteRepositoryError {
  return {
    code: "storage_unavailable",
    message: `Erreur Supabase : ${message}`,
    cause,
  };
}

function toPayloadError(cause: unknown): NoteRepositoryError {
  return {
    code: "storage_payload_invalid",
    message: "Les donnees retournees par Supabase sont invalides.",
    cause,
  };
}
