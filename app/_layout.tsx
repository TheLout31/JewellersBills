import { Stack } from "expo-router";
import StackNavigator from "./Navigation/stackNavigation";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <StackNavigator />
    </PaperProvider>
  );
}
