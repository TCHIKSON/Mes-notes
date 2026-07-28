import { NavigationContainer } from "@react-navigation/native";
import { useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FeedbackView } from "@/presentation/components/FeedbackView";
import { AppNavigator } from "@/presentation/navigation/AppNavigator";
import { theme } from "@/presentation/styles/theme";
import { createAppDependencies } from "@/main/createAppDependencies";
import { DependenciesProvider } from "@/main/DependenciesContext";

export default function App() {
  const dependenciesResult = useMemo(() => createAppDependencies(), []);

  if (!dependenciesResult.ok) {
    return (
      <SafeAreaProvider>
        <FeedbackView
          message={dependenciesResult.error.message}
          title="Configuration Supabase"
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <DependenciesProvider dependencies={dependenciesResult.value}>
        <NavigationContainer theme={theme.navigation}>
          <AppNavigator />
        </NavigationContainer>
      </DependenciesProvider>
    </SafeAreaProvider>
  );
}
