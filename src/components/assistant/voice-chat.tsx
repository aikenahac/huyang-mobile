import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAssistantStore } from "@/lib/assistant-store";
import { getElevenLabsAgentId } from "@/lib/elevenlabs";
import { KeyboardIcon, SendIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { UnstableSiriOrb } from "@/shared/ui/organisms/unstable_siri_orb";
import { useConversation } from "@elevenlabs/react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_VISIBLE_MESSAGES = 14;

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
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const pendingMessageRef = useRef<string | null>(null);
  const lastSentTextRef = useRef<string | null>(null);
  const transcriptScrollRef = useRef<ScrollView | null>(null);

  const [isSessionBusy, setIsSessionBusy] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);

  const orbEnterProgress = useSharedValue(0);
  const orbBreatheScale = useSharedValue(1);

  const conversation = useConversation({
    onModeChange: ({ mode }) => {
      const assistantSpeaking = mode === "speaking";
      setSpeaking(assistantSpeaking);

      if (assistantSpeaking) {
        stopListening();
        return;
      }

      startListening();
    },
    onStatusChange: ({ status }) => {
      if (status === "connected") {
        startListening();
        const pendingMessage = pendingMessageRef.current;

        if (pendingMessage) {
          pendingMessageRef.current = null;
          try {
            conversation.sendUserMessage(pendingMessage);
          } catch (error) {
            console.error("ElevenLabs pending message failed", error);
            addMessage(
              "assistant",
              "I connected, but could not send your last message.",
            );
          }
        }
        return;
      }

      stopListening();
      setSpeaking(false);
    },
    onMessage: ({ message, source, role }) => {
      const text = message.trim();
      if (!text) return;

      const sourceName = String(source ?? "");
      const roleName = String(role ?? "");

      if (sourceName === "ai" || roleName === "assistant") {
        addMessage("assistant", text);
        return;
      }

      if (sourceName === "user" || roleName === "user") {
        if (lastSentTextRef.current === text.toLowerCase()) {
          lastSentTextRef.current = null;
          return;
        }
        addMessage("user", text);
      }
    },
    onError: (message, context) => {
      console.error("ElevenLabs conversation failed", message, context);
      addMessage(
        "assistant",
        "I could not connect to ElevenLabs. Please check the agent setup.",
      );
    },
  });

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";
  const isUserTurn = isConnected && isListening && !isSpeaking;

  const orbSize = Math.min(Math.max(width * 0.58, 190), 250);

  const transcriptMessages = useMemo(
    () => messages.slice(-MAX_VISIBLE_MESSAGES),
    [messages],
  );

  const liveStatusText = useMemo(() => {
    if (isConnecting || isSessionBusy) return "Connecting to Huyang...";
    if (isSpeaking) return "Huyang is speaking";
    if (isUserTurn) return "Listening for your voice";
    if (isConnected) return "Voice mode ready";
    return "Tap the orb to start voice mode";
  }, [isConnected, isConnecting, isSessionBusy, isSpeaking, isUserTurn]);

  useEffect(() => {
    orbEnterProgress.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    orbBreatheScale.value = withDelay(
      240,
      withRepeat(
        withTiming(1.035, {
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );
  }, [orbBreatheScale, orbEnterProgress]);

  useEffect(() => {
    if (isConnected || isConnecting || isListening || isSpeaking) {
      setIsTextMode(false);
    }
  }, [isConnected, isConnecting, isListening, isSpeaking]);

  const orbShellAnimatedStyle = useAnimatedStyle(() => {
    const baseScale = 0.94 + orbEnterProgress.value * 0.06;
    return {
      opacity: orbEnterProgress.value,
      transform: [
        { scale: baseScale * orbBreatheScale.value },
        { translateY: (1 - orbEnterProgress.value) * 10 },
      ],
    };
  });

  async function ensureSession(): Promise<boolean> {
    if (isConnected) return true;
    if (isConnecting || isSessionBusy) return false;

    setIsSessionBusy(true);
    try {
      const agentId = getElevenLabsAgentId();
      await conversation.startSession({
        agentId,
        userId: "huyang-mobile",
      });
      return true;
    } catch (error) {
      console.error("ElevenLabs session failed", error);
      addMessage(
        "assistant",
        "I could not start the voice session. Check your agent ID and build.",
      );
      stopListening();
      setSpeaking(false);
      return false;
    } finally {
      setIsSessionBusy(false);
    }
  }

  async function handleToggleVoiceMode() {
    if (isSessionBusy) return;

    if (isConnected) {
      try {
        await conversation.endSession();
      } catch (error) {
        console.error("ElevenLabs end session failed", error);
      }
      return;
    }

    await ensureSession();
  }

  async function handleSendText() {
    if (!currentInput.trim()) return;

    const text = currentInput.trim();
    lastSentTextRef.current = text.toLowerCase();
    addMessage("user", text);
    setInput("");

    try {
      if (!isConnected) {
        pendingMessageRef.current = text;
        const didStart = await ensureSession();
        if (!didStart) {
          return;
        }
      } else {
        conversation.sendUserMessage(text);
      }
    } catch (error) {
      console.error("ElevenLabs message failed", error);
      pendingMessageRef.current = null;
      lastSentTextRef.current = null;
      addMessage("assistant", "I could not send your message to ElevenLabs.");
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 gap-4" style={{ paddingBottom: insets.bottom }}>
        <View className="flex-1 rounded-3xl border border-border/70 bg-card/70 px-3 py-4">
          <View className="mb-3 flex-row items-center justify-between px-1">
            <Text className="text-base font-semibold text-foreground">
              Live transcription
            </Text>
            <Text
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                isConnected ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isConnected ? "Live" : "Idle"}
            </Text>
          </View>

          {transcriptMessages.length ? (
            <ScrollView
              ref={transcriptScrollRef}
              className="flex-1"
              contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                transcriptScrollRef.current?.scrollToEnd({ animated: true });
              }}
            >
              {transcriptMessages.map((message) => {
                const isUser = message.speaker === "user";
                return (
                  <View
                    key={message.id}
                    className={cn(
                      "max-w-[90%] rounded-3xl border px-4 py-3",
                      isUser
                        ? "self-end border-primary/30 bg-primary"
                        : "self-start border-border/80 bg-secondary/20",
                    )}
                  >
                    <Text
                      className={cn(
                        "mb-1 text-[11px] font-semibold uppercase tracking-wide",
                        isUser
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground",
                      )}
                    >
                      {isUser ? "You" : "Huyang"}
                    </Text>
                    <Text
                      className={cn(
                        "text-sm leading-6",
                        isUser ? "text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {message.text}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-center text-sm text-muted-foreground">
                Start talking and your conversation transcript will appear here.
              </Text>
            </View>
          )}
        </View>

        <View className="items-center gap-3 pb-1">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={isSessionBusy}
            onPress={handleToggleVoiceMode}
            accessibilityRole="button"
            accessibilityLabel="Toggle voice mode"
          >
            <Animated.View
              style={orbShellAnimatedStyle}
              className={cn(
                "items-center justify-center rounded-full border border-border/70 bg-background p-2",
                isUserTurn && "border-primary/60",
                isSpeaking && "border-secondary/70",
              )}
            >
              <UnstableSiriOrb
                size={orbSize}
                speed={isUserTurn ? 1.75 : isSpeaking ? 1.35 : 1}
                noiseIntensity={isUserTurn ? 1.3 : 0.95}
                glowIntensity={isUserTurn ? 2.2 : isSpeaking ? 1.95 : 1.45}
                rotationSpeed={isSpeaking ? 1.5 : 1}
                brightness={isUserTurn ? 1.12 : 1}
                saturation={2.15}
                primaryColor={
                  isUserTurn
                    ? { r: 0.31, g: 0.73, b: 1.0 }
                    : { r: 0.56, g: 0.42, b: 1.0 }
                }
                secondaryColor={
                  isSpeaking
                    ? { r: 1.0, g: 0.42, b: 0.66 }
                    : { r: 0.0, g: 0.79, b: 0.87 }
                }
              />
            </Animated.View>
          </TouchableOpacity>

          <Text className="text-sm font-medium text-muted-foreground">
            {liveStatusText}
          </Text>

          <View className="w-full flex-row items-center justify-start gap-2">
            <Button
              variant={isTextMode ? "secondary" : "outline"}
              size="icon"
              onPress={() => setIsTextMode((value) => !value)}
            >
              <Icon
                as={KeyboardIcon}
                size={18}
                className={
                  isTextMode ? "text-secondary-foreground" : "text-foreground"
                }
              />
            </Button>

            {isTextMode ? (
              <>
                <View className="h-12 flex-1 justify-center rounded-2xl border border-border bg-background px-3">
                  <TextInput
                    value={currentInput}
                    onChangeText={setInput}
                    editable
                    multiline={false}
                    placeholder="Type a message"
                    placeholderTextColor="#94A3B8"
                    style={{ textAlignVertical: "center", paddingVertical: 0 }}
                    className="h-10 text-sm text-foreground"
                  />
                </View>

                <Button
                  size="icon"
                  onPress={handleSendText}
                  disabled={!currentInput.trim() || isSessionBusy}
                >
                  <Icon
                    as={SendIcon}
                    size={16}
                    className="text-primary-foreground"
                  />
                </Button>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
