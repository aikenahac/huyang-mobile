// @ts-ignore
import React, { memo, useMemo } from "react";
import { Canvas, Shader, Fill, Skia } from "@shopify/react-native-skia";
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
  type FrameInfo,
} from "react-native-reanimated";
import {
  AURORA_STATE_STYLES,
  DEFAULT_AURORA_COLORS,
  DEFAULT_SKY_COLORS,
} from "./const";
import { AURORA_VERTEX_SHADER } from "./conf";
import { hexToRgb } from "./helper";
import type { IAurora } from "./types";
import { useWindowDimensions } from "react-native";

const SHADER = Skia.RuntimeEffect.Make(AURORA_VERTEX_SHADER)!;

export const Aurora = memo(
  ({
    width: paramsWidth,
    height: paramsHeight,
    auroraColors,
    skyColors,
    speed = 0.5,
    intensity = 1,
    waveDirection,
    state = "idle",
  }: IAurora): React.JSX.Element | null => {
      const time = useSharedValue<number>(0);
      useFrameCallback((frameInfo: FrameInfo) => {
        if (frameInfo.timeSincePreviousFrame != null) {
          time.value += frameInfo.timeSincePreviousFrame / 1000;
        }
      });
      const stateStyle = useMemo(
        () => AURORA_STATE_STYLES[state],
        [state],
      );
      const resolvedAuroraColors = useMemo(
        () => auroraColors ?? stateStyle.auroraColors,
        [auroraColors, stateStyle],
      );
      const resolvedSkyColors = useMemo(
        () => skyColors ?? stateStyle.skyColors,
        [skyColors, stateStyle],
      );
      const resolvedWaveDirection = useMemo(
        () => waveDirection ?? stateStyle.waveDirection,
        [waveDirection, stateStyle],
      );
      const color1 = useMemo(
        () =>
          hexToRgb<string>(
            resolvedAuroraColors[0] ?? DEFAULT_AURORA_COLORS[0],
          ),
        [resolvedAuroraColors],
      );
      const color2 = useMemo(
        () =>
          hexToRgb<string>(
            resolvedAuroraColors[1] ?? DEFAULT_AURORA_COLORS[1],
          ),
        [resolvedAuroraColors],
      );
      const color3 = useMemo(
        () =>
          hexToRgb<string>(
            resolvedAuroraColors[2] ?? DEFAULT_AURORA_COLORS[2],
          ),
        [resolvedAuroraColors],
      );
      const skyTop = useMemo(
        () => hexToRgb<string>(resolvedSkyColors[0] ?? DEFAULT_SKY_COLORS[0]),
        [resolvedSkyColors],
      );
      const skyBottom = useMemo(
        () => hexToRgb<string>(resolvedSkyColors[1] ?? DEFAULT_SKY_COLORS[1]),
        [resolvedSkyColors],
      );
      const { width: screenWidth, height: screenHeight } =
        useWindowDimensions();

      const width = paramsWidth ?? screenWidth;
      const height = paramsHeight ?? screenHeight * 0.25;
      const resolvedSpeed = useMemo(
        () => speed * stateStyle.speedMultiplier,
        [speed, stateStyle],
      );
      const resolvedIntensity = useDerivedValue(() => {
        "worklet";
        const baseIntensity = intensity * stateStyle.intensityMultiplier;
        if (state === "speaking") {
          const pulse =
            1 +
            stateStyle.pulseAmplitude *
              (0.5 + 0.5 * Math.sin(time.value * stateStyle.pulseFrequency));
          return baseIntensity * pulse;
        }
        return baseIntensity;
      }, [intensity, state, stateStyle, time]);

      const uniforms = useDerivedValue(() => {
        "worklet";
        return {
          resolution: [width, height] as [number, number],
          time: time.value,
          color1: color1 as [number, number, number],
          color2: color2 as [number, number, number],
          color3: color3 as [number, number, number],
          skyTop: skyTop as [number, number, number],
          skyBottom: skyBottom as [number, number, number],
          speed: resolvedSpeed,
          intensity: resolvedIntensity.value,
          waveDirection: resolvedWaveDirection as [number, number],
        } as const;
      }, [
        width,
        height,
        color1,
        color2,
        color3,
        skyTop,
        skyBottom,
        resolvedSpeed,
        resolvedIntensity,
        resolvedWaveDirection,
      ]);

    return (
      <Canvas style={{ width, height: height + 100 }}>
        <Fill>
          <Shader source={SHADER} uniforms={uniforms} />
        </Fill>
      </Canvas>
    );
  },
);

Aurora.displayName = "Aurora";

export default Aurora;
