import type { AuroraState } from "./types";

type AuroraStateStyle = {
  auroraColors: [string, string, string];
  skyColors: [string, string];
  speedMultiplier: number;
  intensityMultiplier: number;
  waveDirection: [number, number];
  pulseAmplitude: number;
  pulseFrequency: number;
};

const AURORA_STATE_STYLES: Record<AuroraState, AuroraStateStyle> = {
  idle: {
    auroraColors: ["#D46BFF", "#A855F7", "#F472B6"],
    skyColors: ["#120022", "#1F1038"],
    speedMultiplier: 1,
    intensityMultiplier: 1,
    waveDirection: [9, -9],
    pulseAmplitude: 0,
    pulseFrequency: 0,
  },
  speaking: {
    auroraColors: ["#D46BFF", "#A855F7", "#F472B6"],
    skyColors: ["#120022", "#1F1038"],
    speedMultiplier: 1.85,
    intensityMultiplier: 1.3,
    waveDirection: [13, -12],
    pulseAmplitude: 0.28,
    pulseFrequency: 7.5,
  },
  thinking: {
    auroraColors: ["#22D3EE", "#14B8A6", "#34D399"],
    skyColors: ["#021A1F", "#062B2F"],
    speedMultiplier: 1.25,
    intensityMultiplier: 1.1,
    waveDirection: [10, -7],
    pulseAmplitude: 0,
    pulseFrequency: 0,
  },
  processing: {
    auroraColors: ["#22D3EE", "#14B8A6", "#34D399"],
    skyColors: ["#021A1F", "#062B2F"],
    speedMultiplier: 1.25,
    intensityMultiplier: 1.1,
    waveDirection: [10, -7],
    pulseAmplitude: 0,
    pulseFrequency: 0,
  },
  error: {
    auroraColors: ["#F87171", "#EF4444", "#B91C1C"],
    skyColors: ["#220404", "#2E0808"],
    speedMultiplier: 1.05,
    intensityMultiplier: 1.2,
    waveDirection: [8, -6],
    pulseAmplitude: 0,
    pulseFrequency: 0,
  },
};

const DEFAULT_AURORA_COLORS: [string, string, string] =
  AURORA_STATE_STYLES.idle.auroraColors;
const DEFAULT_SKY_COLORS: [string, string] = AURORA_STATE_STYLES.idle.skyColors;

export { AURORA_STATE_STYLES, DEFAULT_AURORA_COLORS, DEFAULT_SKY_COLORS };
