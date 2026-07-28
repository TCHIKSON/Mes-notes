import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NoteDetailScreen } from "@/presentation/screens/NoteDetailScreen";
import { NotesListScreen } from "@/presentation/screens/NotesListScreen";
import type { RootStackParamList } from "@/presentation/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={NotesListScreen}
        name="NotesList"
        options={{ title: "Mes notes" }}
      />
      <Stack.Screen
        component={NoteDetailScreen}
        name="NoteDetail"
        options={{ title: "Detail" }}
      />
    </Stack.Navigator>
  );
}
