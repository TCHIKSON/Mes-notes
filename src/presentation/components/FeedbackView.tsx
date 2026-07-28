import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/presentation/styles/theme";

type FeedbackViewProps = Readonly<{
  message: string;
  title?: string;
  isLoading?: boolean;
}>;

export function FeedbackView({ isLoading = false, message, title }: FeedbackViewProps) {
  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator color={colors.primary} size="large" /> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
    justifyContent: "center",
    padding: spacing.lg
  },
  message: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center"
  }
});
