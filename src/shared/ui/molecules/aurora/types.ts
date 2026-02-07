type AuroraState = "idle" | "speaking" | "thinking" | "processing" | "error";

interface IAurora {
  width?: number;
  height?: number;
  auroraColors?: string[];
  skyColors?: [string, string];
  speed?: number;
  intensity?: number;
  waveDirection?: [number, number];
  state?: AuroraState;
}

export type { IAurora, AuroraState };
