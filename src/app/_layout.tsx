import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/lib/i18n";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@/lib/theme-context";
import { QueryProvider } from "@/lib/query";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { colorScheme } = useColorScheme();
  const effectiveColorScheme = colorScheme ?? "light";
  const [fontsLoaded] = useFonts({
    "JetBrains Mono": JetBrainsMono_400Regular,
    "JetBrains Mono Medium": JetBrainsMono_500Medium,
    "JetBrains Mono Bold": JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <QueryProvider>
        <NavThemeProvider value={NAV_THEME[effectiveColorScheme]}>
          <ElevenLabsProvider>
            <View
              style={{ flex: 1 }}
              className={
                effectiveColorScheme === "dark"
                  ? "dark bg-background"
                  : "bg-background"
              }
            >
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="home/index" />
              </Stack>
              <StatusBar
                style={effectiveColorScheme === "dark" ? "light" : "dark"}
                translucent
                backgroundColor="transparent"
              />
              <PortalHost />
            </View>
          </ElevenLabsProvider>
        </NavThemeProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
