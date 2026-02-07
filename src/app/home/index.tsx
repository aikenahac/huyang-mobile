import { ScreenContainer } from "@/components/screen-container";
import { VoiceChat } from "@/components/assistant/voice-chat";
import { Aurora } from "@/shared/ui/molecules/aurora";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 bg-background">
        <View pointerEvents="none" className="absolute left-0 right-0 top-0 z-0">
          <Aurora state="idle" height={220} />
        </View>
        <View className="z-10 flex-1 p-6">
          <VoiceChat />
        </View>
      </View>
    </ScreenContainer>
  );
}
