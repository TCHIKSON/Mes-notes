import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { useDependencies } from "@/main/DependenciesContext";
import { colors, spacing } from "@/presentation/styles/theme";
import type { RootStackParamList } from "@/presentation/types/navigation";

type NoteDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NoteDetail"
>;

export function NoteDetailScreen({ navigation, route }: NoteDetailScreenProps) {
  const { note } = route.params;
  const { noteService } = useDependencies();
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await noteService.updateNote(note.id, { title: note.title, content });
    setIsSaving(false);
  }

  async function handleDelete() {
    const result = await noteService.deleteNote(note.id);

    if (result.ok) {
      navigation.goBack();
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
      </View>

      <TextInput
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.bodyInput}
        textAlignVertical="top"
      />

      <View style={styles.detailActions}>
        <Pressable
          onPress={handleDelete}
          style={styles.deleteAction}
          accessibilityRole="button"
        >
          <Text style={styles.deleteActionText}>Supprimer</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={styles.saveAction}
          accessibilityRole="button"
          disabled={isSaving}
        >
          <Text style={styles.saveActionText}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoDate));
}

const styles = StyleSheet.create({
  bodyInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 200,
    padding: spacing.md
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg
  },
  date: {
    color: colors.muted,
    fontSize: 14
  },
  deleteAction: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  deleteActionText: {
    color: colors.danger,
    fontWeight: "700"
  },
  detailActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  saveAction: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  saveActionText: {
    color: colors.surface,
    fontWeight: "700"
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800"
  }
});
