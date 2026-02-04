import { createClient } from "@elevenlabs/react-native";

/**
 * ElevenLabs React Native SDK helper.
 *
 * This uses the official SDK instead of raw HTTP. It expects:
 * - EXPO_PUBLIC_ELEVENLABS_API_KEY
 * - EXPO_PUBLIC_ELEVENLABS_VOICE_ID
 *
 * You still shouldn't ship the API key in a public build, but for now
 * this keeps everything client-side until a backend exists.
 */

const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const defaultVoiceId = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID;

if (!apiKey) {
  console.warn("[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_API_KEY");
}
if (!defaultVoiceId) {
  console.warn("[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_VOICE_ID");
}

export const elevenLabsClient = createClient({
  apiKey: apiKey ?? "",
});

export async function speakWithElevenLabs(text: string): Promise<void> {
  if (!apiKey || !defaultVoiceId) {
    throw new Error("ElevenLabs is not configured. Check your env vars.");
  }

  // Basic, non-streaming text-to-speech using the SDK.
  await elevenLabsClient.generate({
    voice: defaultVoiceId,
    text,
  });
}
