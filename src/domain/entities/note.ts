export type Note = Readonly<{
  id: string;
  title: string;
  content: string;
  createdAt: string;
}>;

export type CreateNoteCommand = Readonly<{
  title: string;
  content: string;
}>;
