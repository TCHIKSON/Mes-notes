import type { Note } from "@/domain/entities/note";

export type RootStackParamList = {
  NotesList: undefined;
  NoteDetail: {
    note: Note;
  };
};
