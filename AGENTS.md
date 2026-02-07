# Agents Guide (huyang-mobile)

This file is for coding agents working in this repository.
Keep changes aligned with existing Expo + React Native conventions.

## Project Snapshot

- Stack: Expo Router + React Native + TypeScript.
- Styling: NativeWind (Tailwind-style classes) + global CSS variables.
- State: Zustand for assistant, TanStack Query with MMKV cache.
- API: axios instance in `src/lib/query.tsx`.
- i18n: `react-i18next` with `src/lib/i18n.ts`.

## Commands

Package manager: npm (pnpm lock exists but npm scripts are used).

### Run the app

- `npm start` (Expo dev server)
- `npm run ios`
- `npm run android`
- `npm run web`

### Lint

- `npm run lint` (Expo ESLint)

### Build

- `npm run build` (interactive EAS build wrapper)
  - Prompts for platform, build profile, and local/EAS.
  - Uses `eas build` behind the scenes.

### Reset

- `npm run reset-project` (cleans to a starter state)

### Tests

- No test runner is configured in `package.json`.
- Single test execution is not available yet.
- If you add tests, document the runner and the single-test command here.
- Prefer lightweight, device-agnostic tests (pure TS/logic) when possible.

## Cursor/Copilot Rules

- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.

## Code Style

Use existing patterns; keep diffs small and consistent.

### Formatting

- Prettier config: semicolons required; double quotes; trailing commas.
- ESLint: `eslint-config-expo` with minimal overrides.
- VS Code settings prefer explicit organize imports and fix-all on save.
- Keep formatting stable; avoid reformatting unrelated files.

### Imports

- Prefer absolute imports via `@/` alias for `src/*`.
- Group imports by source: React/React Native, third-party, then local.
- Keep named imports sorted by the file’s existing style.

### TypeScript

- Strict mode is enabled (`tsconfig.json`).
- Use explicit types where inference is unclear (esp. public APIs).
- Prefer `type` for unions/aliases; `interface` only when extending.
- Avoid `any`; use `unknown` + narrowing when needed.
- Use `ReactNode`/`React.ComponentProps` patterns for component props.
- Prefer `as const` for immutable maps and translation key lists.

### Naming

- Components: PascalCase (`VoiceChat`, `ThemeSwitcher`).
- Hooks: `useX` prefix.
- Zustand actions: verb-first (`setInput`, `addMessage`).
- Files: kebab-case for folders/files; `index.tsx` for route screens.

### React / Expo Router

- Routes live under `src/app`; use file-based routing.
- The root layout is `src/app/_layout.tsx`.
- Use `useRouter()` for navigation.
- Keep `react-native-reanimated` import in the root layout.
- Typed routes are enabled; use literal route strings that match the file path.

### Styling (NativeWind)

- Use `className` for styling; avoid inline styles unless necessary.
- Compose class strings via `cn()` from `src/lib/utils.ts`.
- Use `class-variance-authority` for component variants.
- Keep platform-specific styles behind `Platform.select`.
- Maintain light/dark theming via CSS variables in `src/global.css`.
- For one-off layout tweaks, prefer utility classes over new custom styles.

### UI Components

- Prefer reusable components in `src/components/ui/*`.
- Keep shadcn-style APIs intact (variants, sizes, `asChild`).
- Use `TextClassContext` patterns for text styling consistency.

### Data + Networking

- Use the shared axios instance in `src/lib/query.tsx`.
- TanStack Query is preconfigured; prefer `QueryProvider` usage.
- MMKV is used for persistence; avoid direct storage in random files.
- Keep network timeouts and retries centralized in `query.tsx`.

### Error Handling

- Provide user-friendly errors in UI flows.
- For storage/network, catch and fail gracefully (see `query.tsx`).
- Avoid silent failures unless intentionally best-effort.
- When adding new flows, surface errors through UI copy or toasts.

### i18n

- Use `useTranslation()` and keys from `src/locales/*.json`.
- Keep text in translation files rather than hardcoded strings.
- Add new strings to all locale files (`en.json`, `sl.json`).

### Dates/Times

- Use `date-fns` for formatting and manipulation.
- Do not introduce `moment` or other date libs.

### State + Storage

- Store assistant UI state in `src/lib/assistant-store.ts` (Zustand).
- Use MMKV helpers in `src/lib/storage.ts` and `src/lib/secure-storage.ts`.
- Avoid creating new storage instances unless there is a clear need.

### Accessibility + UX

- Use `Text` from `src/components/ui/text` for consistent typography.
- Keep touch targets reasonable and avoid nesting multiple Pressables.
- Provide descriptive labels for interactive elements where possible.

### Environment + Config

- Public env vars are prefixed with `EXPO_PUBLIC_`.
- Example env values live in `.env.example`.
- Do not commit real API keys; keep secrets out of the repo.

### Project Structure (high level)

- `src/app/*`: Expo Router screens.
- `src/components/*`: shared UI and feature components.
- `src/lib/*`: data, utilities, and platform integration.
- `src/locales/*`: translation dictionaries.
- `src/global.css`: theme tokens and base styles.

## Files to Know

- `src/app/_layout.tsx`: app shell and providers.
- `src/app/home/index.tsx`: assistant home and UI examples.
- `src/lib/query.tsx`: axios + TanStack Query setup.
- `src/lib/assistant-store.ts`: Zustand state model.
- `src/global.css`: theme variables.
- `src/lib/i18n.ts`: i18n configuration and initialization.
- `src/components/ui/*`: shadcn-style components.

## Contribution Tips

- Follow existing formatting and import ordering in touched files.
- Keep UI props and variant types consistent with existing components.
- Keep changes in single-purpose commits when possible.
- Update this document when you add new tooling or conventions.
