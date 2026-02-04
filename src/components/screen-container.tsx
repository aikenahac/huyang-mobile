import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      {children}
    </SafeAreaView>
  )
}