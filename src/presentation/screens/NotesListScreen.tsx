import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import type { Note } from "@/domain/entities/note";
import { FeedbackView } from "@/presentation/components/FeedbackView";
import { NoteItem } from "@/presentation/components/NoteItem";
import { useNotesListController } from "@/presentation/hooks/useNotesListController";
import { colors, spacing } from "@/presentation/styles/theme";
import type { RootStackParamList } from "@/presentation/types/navigation";

type NotesListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NotesList"
>;

export function NotesListScreen({ navigation }: NotesListScreenProps) {
  const controller = useNotesListController();

  async function handleDelete(note: Note) {
    await controller.deleteNote(note.id);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.screen}
    >
      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Titre de la note"
          onChangeText={controller.setDraftTitle}
          placeholder="Titre de la note"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={controller.draftTitle}
        />
        <Pressable
          accessibilityRole="button"
          disabled={controller.isSubmitDisabled}
          onPress={controller.submitNote}
          style={({ pressed }) => [
            styles.button,
            controller.isSubmitDisabled ? styles.buttonDisabled : null,
            pressed ? styles.buttonPressed : null
          ]}
        >
          <Text style={styles.buttonText}>
            {controller.isCreating ? "Creation..." : "+"}
          </Text>
        </Pressable>
      </View>

      {controller.formMessage ? (
        <Text accessibilityRole="alert" style={styles.formError}>
          {controller.formMessage}
        </Text>
      ) : null}

      <NotesContent
        onDeleteNote={handleDelete}
        onOpenNote={(note) => navigation.navigate("NoteDetail", { note })}
        onRetry={controller.loadNotes}
        state={controller.notesState}
      />
    </KeyboardAvoidingView>
  );
}

type NotesContentProps = Readonly<{
  onDeleteNote: (note: Note) => void;
  onOpenNote: (note: Note) => void;
  onRetry: () => Promise<void>;
  state: ReturnType<typeof useNotesListController>["notesState"];
}>;

function NotesContent({ onDeleteNote, onOpenNote, onRetry, state }: NotesContentProps) {
  if (state.status === "loading") {
    return <FeedbackView isLoading message="Chargement des notes..." />;
  }

  if (state.status === "error") {
    return (
      <View style={styles.feedbackArea}>
        <FeedbackView
          message={state.message}
          title="Impossible de charger les notes"
        />
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Reessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (state.notes.length === 0) {
    return (
      <FeedbackView
        message="Aucune note - utilisez le champ ci-dessus pour en creer une."
        title="Liste vide"
      />
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={state.notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NoteItem note={item} onPress={onOpenNote} onDelete={onDeleteNote} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: spacing.lg
  },
  buttonDisabled: {
    opacity: 0.45
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700"
  },
  feedbackArea: {
    flex: 1
  },
  form: {
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  formError: {
    color: colors.danger,
    paddingHorizontal: spacing.md
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  list: {
    gap: spacing.sm,
    padding: spacing.md,
    paddingTop: 0
  },
  retryButton: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  retryText: {
    color: colors.surface,
    fontWeight: "700"
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  }
});
