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
import { NativeTabs, Icon, Label, VectorIcon } from "expo-router/unstable-native-tabs";
import createIconSet from "@expo/vector-icons/createIconSet";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { View } from "react-native";

const glyphMap = {
  bot: 0xe1bb,
  house: 0xe0f5,
  server: 0xe153,
};

const LucideIcon = createIconSet(
  glyphMap,
  "Lucide",
  require("@/lib/assets/lucide-font/lucide.ttf"),
);
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
    Lucide: require("@/lib/assets/lucide-font/lucide.ttf"),
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
              <NativeTabs>
                <NativeTabs.Trigger name="home">
                  <Icon
                    selectedColor={"#fda5d5"}
                    src={<VectorIcon family={LucideIcon} name="bot" />}
                  />
                  <Label hidden />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="smart-home">
                  <Icon
                    selectedColor={"#fda5d5"}
                    src={<VectorIcon family={LucideIcon} name="house" />}
                  />
                  <Label hidden />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="server">
                  <Icon
                    selectedColor={"#fda5d5"}
                    src={<VectorIcon family={LucideIcon} name="server" />}
                  />
                  <Label hidden />
                </NativeTabs.Trigger>
              </NativeTabs>
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
