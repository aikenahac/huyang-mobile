import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/lib/i18n";
import { QueryProvider } from "@/lib/query";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@/lib/theme-context";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import createIconSet from "@expo/vector-icons/createIconSet";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

const glyphMap = {
  bot: 0xe1bb,
  house: 0xe0f5,
  server: 0xe153,
};

const LucideIcons = createIconSet(
  glyphMap,
  "Lucide",
  require("@/lib/assets/lucide-font/lucide.ttf"),
);

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
                <NativeTabs.Trigger name="index">
                  <NativeTabs.Trigger.Icon
                    selectedColor={"#fda5d5"}
                    md="smart_toy"
                    src={
                      <NativeTabs.Trigger.VectorIcon
                        family={LucideIcons}
                        name="bot"
                      />
                    }
                  />
                  <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="smart-home/index">
                  <NativeTabs.Trigger.Icon
                    selectedColor={"#fda5d5"}
                    md="home"
                    src={
                      <NativeTabs.Trigger.VectorIcon
                        family={LucideIcons}
                        name="house"
                      />
                    }
                  />
                  <NativeTabs.Trigger.Label>Smart Home</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="server/index">
                  <NativeTabs.Trigger.Icon
                    selectedColor={"#fda5d5"}
                    md="dns"
                    src={
                      <NativeTabs.Trigger.VectorIcon
                        family={LucideIcons}
                        name="server"
                      />
                    }
                  />
                  <NativeTabs.Trigger.Label>Server</NativeTabs.Trigger.Label>
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
