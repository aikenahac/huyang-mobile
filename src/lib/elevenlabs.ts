const elevenLabsAgentId = process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

if (!elevenLabsAgentId) {
  console.warn("[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_AGENT_ID");
}

export function getElevenLabsAgentId(): string {
  if (!elevenLabsAgentId) {
    throw new Error(
      "ElevenLabs is not configured. Set EXPO_PUBLIC_ELEVENLABS_AGENT_ID.",
    );
  }

  return elevenLabsAgentId;
}
