import { useMemo } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/lib/assistant-store";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Send } from "lucide-react-native";
import { speakWithElevenLabs } from "@/lib/elevenlabs";

export function VoiceChat() {
  const {
    messages,
    isListening,
    isSpeaking,
    currentInput,
    startListening,
    stopListening,
    setSpeaking,
    setInput,
    addMessage,
  } = useAssistantStore();

  const hasMessages = messages.length > 0;

  const latestSpeaker = useMemo(
    () => (messages.length ? messages[messages.length - 1].speaker : null),
    [messages],
  );

  function handleToggleSpeak() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  async function handleSendText() {
    if (!currentInput.trim()) return;

    const text = currentInput.trim();
    addMessage("user", text);
    setInput("");

    setSpeaking(true);
    try {
      await speakWithElevenLabs(text);
      // For now we only synthesize audio; you can plug in
      // the actual OpenClaw / LLM reply here later.
      addMessage(
        "assistant",
        "(ElevenLabs TTS call completed – wire playback and assistant reply here.)",
      );
    } catch (error) {
      console.error("ElevenLabs TTS failed", error);
      addMessage(
        "assistant",
        "I couldn't speak just now because the ElevenLabs call failed.",
      );
    } finally {
      setSpeaking(false);
    }
  }

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-xl font-semibold text-foreground">
          Talk to Huyang
        </Text>
        <Text className="text-muted-foreground text-sm">
          Use the speak button for voice, or type below. ElevenLabs wiring
          will plug into this shell.
        </Text>
      </View>

      {/* Activity indicators */}
      <View className="flex-row gap-3">
        {/* User indicator */}
        <View className="flex-1 flex-row items-center gap-3 rounded-2xl bg-primary/5 px-3 py-2">
          <View className="h-3 w-3 rounded-full bg-primary" />
          <View className="flex-1">
            <Text className="text-xs font-medium text-foreground uppercase tracking-wide">
              You
            </Text>
            <Text className="text-xs text-muted-foreground">
              {isListening ? "Listening…" : "Tap Speak to start talking"}
            </Text>
          </View>
        </View>

        {/* Assistant indicator */}
        <View className="flex-1 flex-row items-center gap-3 rounded-2xl bg-secondary/10 px-3 py-2">
          <View
            className={cn(
              "h-3 w-3 rounded-full bg-secondary",
              isSpeaking && "animate-pulse",
            )}
          />
          <View className="flex-1">
            <Text className="text-xs font-medium text-foreground uppercase tracking-wide">
              Huyang
            </Text>
            <Text className="text-xs text-muted-foreground">
              {isSpeaking
                ? "Speaking…"
                : latestSpeaker === "assistant"
                  ? "Waiting for your reply"
                  : "Ready"}
            </Text>
          </View>
        </View>
      </View>

      {/* Conversation preview */}
      <View className="max-h-64 rounded-2xl border border-border bg-card/60 p-3">
        {hasMessages ? (
          <View className="gap-2">
            {messages.slice(-6).map((message) => (
              <View
                key={message.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2",
                  message.speaker === "user"
                    ? "self-end bg-primary"
                    : "self-start bg-secondary/20",
                )}
              >
                <Text
                  className={cn(
                    "text-xs font-medium mb-1",
                    message.speaker === "user"
                      ? "text-primary-foreground"
                      : "text-secondary-foreground",
                  )}
                >
                  {message.speaker === "user" ? "You" : "Huyang"}
                </Text>
                <Text
                  className={
                    message.speaker === "user"
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }
                >
                  {message.text}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-6">
            <Text className="text-xs text-muted-foreground">
              Your conversation with Huyang will appear here.
            </Text>
          </View>
        )}
      </View>

      {/* Text input + speak button */}
      <View className="flex-row items-end gap-3">
        <View className="flex-1 rounded-2xl border border-border bg-background px-3 py-2">
          <Text className="text-xs text-muted-foreground mb-1">
            Type a message
          </Text>
          <TextInput
            value={currentInput}
            onChangeText={setInput}
            placeholder="Ask anything…"
            placeholderTextColor="#9CA3AF"
            multiline
            className="text-sm text-foreground max-h-24"
          />
        </View>

        <View className="gap-2 items-center">
          <Button
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full bg-primary",
              isListening && "bg-primary/80",
            )}
            onPress={handleToggleSpeak}
          >
            <Icon
              as={isListening ? MicOff : Mic}
              className="text-primary-foreground"
              size={18}
            />
          </Button>

          <TouchableOpacity
            onPress={handleSendText}
            className="flex-row items-center justify-center gap-1"
          >
            <Icon as={Send} size={14} className="text-primary" />
            <Text className="text-xs font-medium text-primary">
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
