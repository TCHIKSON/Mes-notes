import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import type { Note } from "@/domain/entities/note";
import { useDependencies } from "@/main/DependenciesContext";
import { validateCreateNoteForm } from "@/presentation/validation/createNoteFormValidator";

type NotesListState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "error"; message: string }>
  | Readonly<{ status: "ready"; notes: readonly Note[] }>;

export type NotesListController = Readonly<{
  draftTitle: string;
  formMessage: string | null;
  isCreating: boolean;
  isSubmitDisabled: boolean;
  notesState: NotesListState;
  loadNotes: () => Promise<void>;
  setDraftTitle: (title: string) => void;
  submitNote: () => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}>;

export function useNotesListController(): NotesListController {
  const { noteService } = useDependencies();
  const [draftTitle, setDraftTitle] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [notesState, setNotesState] = useState<NotesListState>({
    status: "loading"
  });

  const loadNotes = useCallback(async () => {
    setNotesState({ status: "loading" });
    const result = await noteService.listNotes();

    if (!result.ok) {
      setNotesState({ status: "error", message: result.error.message });
      return;
    }

    setNotesState({ status: "ready", notes: result.value });
  }, [noteService]);

  const submitNote = useCallback(async () => {
    const commandResult = validateCreateNoteForm({ title: draftTitle });

    if (!commandResult.ok) {
      setFormMessage(commandResult.error.message);
      return;
    }

    setIsCreating(true);
    setFormMessage(null);
    const result = await noteService.createNote(commandResult.value);
    setIsCreating(false);

    if (!result.ok) {
      setFormMessage(result.error.message);
      return;
    }

    setDraftTitle("");
    await loadNotes();
  }, [draftTitle, loadNotes, noteService]);

  const deleteNote = useCallback(
    async (id: string) => {
      const result = await noteService.deleteNote(id);

      if (!result.ok) {
        setFormMessage(result.error.message);
        return;
      }

      await loadNotes();
    },
    [loadNotes, noteService]
  );

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes])
  );

  return {
    draftTitle,
    formMessage,
    isCreating,
    isSubmitDisabled: isCreating || draftTitle.trim().length === 0,
    notesState,
    loadNotes,
    setDraftTitle,
    submitNote,
    deleteNote
  };
}
