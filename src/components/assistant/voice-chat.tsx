import { useMemo, useRef, useState } from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAssistantStore } from "@/lib/assistant-store";
import { getElevenLabsAgentId } from "@/lib/elevenlabs";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Send } from "lucide-react-native";

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
  const pendingMessageRef = useRef<string | null>(null);
  const [isSessionBusy, setIsSessionBusy] = useState(false);

  const conversation = useConversation({
    onModeChange: ({ mode }) => {
      if (mode === "speaking") {
        setSpeaking(true);
        stopListening();
        return;
      }

      setSpeaking(false);
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
              "I connected, but couldn't send your last message.",
            );
          }
        }
        return;
      }

      stopListening();
      setSpeaking(false);
    },
    onMessage: ({ message, source, role }) => {
      const speaker = source ?? role;
      if (speaker === "ai") {
        addMessage("assistant", message);
      }
    },
    onError: (message, context) => {
      console.error("ElevenLabs conversation failed", message, context);
      addMessage(
        "assistant",
        "I couldn't connect to ElevenLabs. Please check the agent setup.",
      );
    },
  });

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";

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
        "I couldn't start the voice session. Check your agent ID and build.",
      );
      stopListening();
      setSpeaking(false);
      return false;
    } finally {
      setIsSessionBusy(false);
    }
  }

  const hasMessages = messages.length > 0;

  const latestSpeaker = useMemo(
    () => (messages.length ? messages[messages.length - 1].speaker : null),
    [messages],
  );

  async function handleToggleSpeak() {
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
      addMessage(
        "assistant",
        "I couldn't send your message to ElevenLabs.",
      );
    }
  }

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-xl font-semibold text-foreground">
          Talk to Huyang
        </Text>
        <Text className="text-muted-foreground text-sm">
          Start a session with Speak, then talk or type to your ElevenLabs
          agent.
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
              {isConnected
                ? isListening
                  ? "Listening..."
                  : "Connected"
                : isConnecting || isSessionBusy
                  ? "Connecting..."
                  : "Tap Speak to connect"}
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
                ? "Speaking..."
                : latestSpeaker === "assistant"
                  ? "Waiting for your reply"
                  : isConnected
                    ? "Ready"
                    : isConnecting || isSessionBusy
                      ? "Connecting..."
                    : "Offline"}
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
              isConnected && "bg-primary/80",
              (isConnecting || isSessionBusy) && "bg-primary/60",
            )}
            onPress={handleToggleSpeak}
            disabled={isSessionBusy}
          >
            <Icon
              as={isConnected ? MicOff : Mic}
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
