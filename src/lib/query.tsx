import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import axios from "axios";
import type { ReactNode } from "react";
import { AppState, AppStateStatus } from "react-native";
import { createMMKV } from "react-native-mmkv";

/**
 * Axios instance for all network requests.
 * Configure baseURL and interceptors as needed.
 */
export const api = axios.create({
  baseURL: "https://example.com/api", // TODO: wire to your backend / gateway
  timeout: 15000,
});

// Dedicated MMKV instance for React Query cache
const queryCacheStorage = createMMKV({ id: "query-cache" });

const mmkvPersisterStorage = {
  getItem: (key: string): string | null => {
    try {
      return queryCacheStorage.getString(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      queryCacheStorage.set(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      queryCacheStorage.remove(key);
    } catch {
      // ignore
    }
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 60,
      retry: 2,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: mmkvPersisterStorage,
  throttleTime: 1000,
});

// React Native integrations for online/background state
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

let currentAppState: AppStateStatus = AppState.currentState;

AppState.addEventListener("change", (nextAppState) => {
  if (
    currentAppState.match(/inactive|background/) &&
    nextAppState === "active"
  ) {
    focusManager.setFocused(true);
  }
  currentAppState = nextAppState;
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
