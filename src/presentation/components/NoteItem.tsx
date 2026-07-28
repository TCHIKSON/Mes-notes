import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Note } from "@/domain/entities/note";
import { colors, spacing } from "@/presentation/styles/theme";

type NoteItemProps = Readonly<{
  note: Note;
  onPress: (note: Note) => void;
  onDelete?: (note: Note) => void;
}>;

export function NoteItem({ note, onPress, onDelete }: NoteItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(note)}
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {note.title}
        </Text>
        <Text numberOfLines={1} style={styles.preview}>
          {note.content}
        </Text>
      </View>
      <View style={styles.actions}>
        {typeof onDelete === "function" ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => onDelete(note)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Suppr</Text>
          </Pressable>
        ) : null}
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.chevron}
        >
          &gt;
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chevron: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 72,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  pressed: {
    backgroundColor: "#edf7f9",
  },
  preview: {
    color: colors.muted,
    fontSize: 14,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    fontSize: 18,
  },
});
