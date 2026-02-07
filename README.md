# Huyang Mobile

A React Native (Expo) app that lets you talk to **Huyang** (your OpenClaw agent) using ElevenLabs for voice, with a growing control center for your smart home and servers.

This project is intentionally opinionated and built on top of `hades-expo-boilerplate`, but reshaped into a concrete app rather than a generic starter.

---

## Stack

- **React Native / Expo** (Expo Router)
- **TypeScript**
- **NativeWind** for Tailwind-style styling
- **React Native Reusables** UI components (shadcn-style) already copied into `src/components/ui`
- **Zustand** for assistant state management
- **TanStack Query** with **MMKV-persisted cache** for future data flows
- **MMKV** for local storage
- **ElevenLabs** via `@elevenlabs/react-native` SDK for text-to-speech

---

## Features

### 1. Assistant Home

**File:** `src/app/home/index.tsx`

The home screen is where you interact with Huyang and navigate to future control screens.

Includes:

- **Language & theme switching**
  - `LanguageSwitcher` and `ThemeSwitcher` components.
- **Voice chat with Huyang**
  - `VoiceChat` component:
    - Speak button with distinct **user** vs **assistant** indicators.
    - Manual text input + send.
    - Conversation preview with styled bubbles (user vs assistant).
    - Uses Zustand store for interaction state.
- **Control center cards**
  - Card to open **Smart Home** screen.
  - Card to open **Servers** screen.
- Demo UI sections (buttons, badges, cards, toggles, dropdown, alert-dialog) kept from the boilerplate as examples.

### 2. Smart Home Screen

**File:** `src/app/smart-home/index.tsx`

A stub UI that will later be wired into Home Assistant / your own infra. Right now it provides structured controls with proper UI:

- **Lights**
  - Living room, Bedroom, Kitchen switches with status text.
  - "All off" button (UI only).
- **Blinds**
  - Preset toggles: `Open`, `Half`, `Closed`.
  - Shows current preset.
- **3D Printer**
  - Online/offline switch.
  - Current job status (Printing / Idle).
  - "Start test" / "Pause" button.
  - "Open print queue" button.

Everything uses the same UI system (Card, Switch, Toggle, Button, Text) and NativeWind classes.

### 3. Servers Screen

**File:** `src/app/server/index.tsx`

High-level server control UI, designed to be wired later to Dokploy/Portainer/custom APIs.

- **Core stack card**
  - Toggles for Gateway, Database, and AI node.
  - Short descriptions for each.
- **Actions card**
  - Buttons for:
    - Open logs dashboard
    - Deploy latest tagged release
    - Restart everything
- **Summary card**
  - Derived overall status (`All green` vs `Attention needed`).
  - Explanation that this is UI only for now.

---

## Assistant & Voice Architecture

### 1. Assistant State (Zustand)

**File:** `src/lib/assistant-store.ts`

Central state for the assistant UI:

- Messages: `{ id, speaker: "user" | "assistant", text, createdAt }[]`
- Flags:
  - `isListening`
  - `isSpeaking`
  - `currentInput`
- Actions:
  - `startListening` / `stopListening`
  - `setSpeaking`
  - `setInput`
  - `addMessage(speaker, text)`
  - `reset()`

The UI reads from this store to drive indicators and the conversation preview.

### 2. ElevenLabs Integration (SDK)

**File:** `src/lib/elevenlabs.ts`

Uses the official `@elevenlabs/react-native` SDK instead of raw HTTP.

Env variables (see `.env.example`):

```env
EXPO_PUBLIC_ELEVENLABS_API_KEY=
EXPO_PUBLIC_ELEVENLABS_VOICE_ID=
```

Helper:

```ts
import { createClient } from "@elevenlabs/react-native";

const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const defaultVoiceId = process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID;

export const elevenLabsClient = createClient({ apiKey: apiKey ?? "" });

export async function speakWithElevenLabs(text: string) {
  if (!apiKey || !defaultVoiceId) {
    throw new Error("ElevenLabs is not configured. Check your env vars.");
  }

  await elevenLabsClient.generate({
    voice: defaultVoiceId,
    text,
  });
}
```

### 3. VoiceChat Component

**File:** `src/components/assistant/voice-chat.tsx`

Key behaviors:

- When you press **Send**:
  1. User message is added to the store.
  2. `speakWithElevenLabs(text)` is called (SDK-based TTS).
  3. On success, an assistant message is added noting that the TTS call completed.
  4. On failure, a friendly error message is added.
- Mic button toggles `isListening` and updates the user indicator.
- Assistant indicator uses `isSpeaking` and the latest message speaker.

This is intentionally a shell: later, you will plug in

- live audio streaming, and
- the actual LLM / OpenClaw reply text
  on top of this flow.

---

## Data & Networking

### TanStack Query + MMKV persistence

**File:** `src/lib/query.tsx`

- Creates a `QueryClient` with sensible defaults.
- Persists query cache into a dedicated MMKV instance (`id: "query-cache"`).
- Integrates with React Native app lifecycle:
  - Online/offline via `@react-native-community/netinfo` and `onlineManager`.
  - Focus via `AppState` and `focusManager`.
- Exposes `QueryProvider` which wraps the app in `_layout.tsx`.

This is ready for when you start fetching real data for smart home devices, server status, or assistant sessions.

---

## Project Structure (high level)

```txt
src/
  app/
    _layout.tsx         # Root layout with ThemeProvider, QueryProvider, navigation
    index.tsx           # Entry wiring into home
    home/index.tsx      # Assistant home + control center
    smart-home/index.tsx# Smart home control UI
    server/index.tsx    # Server management UI

  components/
    assistant/
      voice-chat.tsx    # Voice chat UI shell around ElevenLabs + state
    ui/                 # shadcn-style components (button, card, etc.)
    language-switcher.tsx
    screen-container.tsx
    theme-switcher.tsx

  lib/
    assistant-store.ts  # Zustand store for assistant state
    elevenlabs.ts       # ElevenLabs SDK helper
    query.tsx            # TanStack Query + MMKV persistence
    storage.ts          # MMKV storage helpers
    theme.ts / theme-context.tsx
    i18n.ts             # react-i18next setup

  locales/
    en.json
    sl.json

  global.css            # Global theme variables (light/dark)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo tooling installed
- iOS simulator (macOS) or Android emulator / device

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in:

   ```env
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your_key_here
   EXPO_PUBLIC_ELEVENLABS_VOICE_ID=your_voice_id_here
   ```

3. Start the app:

   ```bash
   npm start
   # or
   npm run android
   # or
   npm run ios
   ```

Then open the app in your simulator/device and go to the **Home** screen to start interacting with the assistant and explore the control center.

---

## Roadmap / TODOs

- Hook Huyang mobile up to a real OpenClaw endpoint for:
  - conversational replies
  - session management
- Replace placeholder assistant messages with real LLM output.
- Integrate streaming audio with ElevenLabs (not just one-shot `generate`).
- Wire Smart Home UI to Home Assistant / existing smart home stack.
- Wire Servers UI to Dokploy/Portainer/other infra APIs.
- Harden ElevenLabs key handling (move to backend once it exists).
