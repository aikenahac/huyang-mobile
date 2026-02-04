import axios from "axios";

/**
 * Minimal ElevenLabs TTS helper for client-side usage.
 *
 * NOTE: This assumes you temporarily expose the API key via Expo env:
 * - EXPO_PUBLIC_ELEVENLABS_API_KEY
 * - EXPO_PUBLIC_ELEVENLABS_VOICE_ID
 *
 * This is fine for local/dev while you don't have a backend, but you
 * should move the key server-side before shipping anything public.
 */

const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

function getConfig() {
  const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
  const voiceId = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_ELEVENLABS_API_KEY");
  }
  if (!voiceId) {
    throw new Error("Missing EXPO_PUBLIC_ELEVENLABS_VOICE_ID");
  }

  return { apiKey, voiceId };
}

export type ElevenLabsTtsOptions = {
  text: string;
  modelId?: string;
};

export type ElevenLabsTtsResult = {
  /** Raw audio bytes as an ArrayBuffer (MP3 by default). */
  audio: ArrayBuffer;
};

/**
 * Perform a single text-to-speech request to ElevenLabs.
 * This does not play the audio; it only fetches it.
 */
export async function elevenLabsTextToSpeech(
  options: ElevenLabsTtsOptions,
): Promise<ElevenLabsTtsResult> {
  const { apiKey, voiceId } = getConfig();
  const { text, modelId = "eleven_multilingual_v2" } = options;

  const url = `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}`;

  const response = await axios.post<ArrayBuffer>(
    url,
    {
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
      },
    },
    {
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      responseType: "arraybuffer",
    },
  );

  return { audio: response.data };
}

/**
 * Higher-level helper used by the UI: make a TTS call and leave
 * playback for later. This is where you can plug in expo-av or
 * the official ElevenLabs React Native SDK when you add it.
 */
export async function speakWithElevenLabs(text: string): Promise<void> {
  // eslint-disable-next-line no-useless-catch
  try {
    await elevenLabsTextToSpeech({ text });
    // TODO: integrate expo-av or ElevenLabs RN SDK here to actually
    // play the returned audio buffer.
  } catch (error) {
    // Re-throw so the caller can surface the failure in UI.
    throw error;
  }
}
