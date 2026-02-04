import { create } from "zustand";

export type Speaker = "user" | "assistant";

interface AssistantMessage {
  id: string;
  speaker: Speaker;
  text: string;
  createdAt: number;
}

interface AssistantState {
  messages: AssistantMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  currentInput: string;
  startListening: () => void;
  stopListening: () => void;
  setSpeaking: (speaking: boolean) => void;
  setInput: (text: string) => void;
  addMessage: (speaker: Speaker, text: string) => void;
  reset: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  messages: [],
  isListening: false,
  isSpeaking: false,
  currentInput: "",
  startListening: () => set({ isListening: true }),
  stopListening: () => set({ isListening: false }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setInput: (currentInput) => set({ currentInput }),
  addMessage: (speaker, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `${Date.now()}-${state.messages.length + 1}`,
          speaker,
          text,
          createdAt: Date.now(),
        },
      ],
    })),
  reset: () =>
    set({
      messages: [],
      isListening: false,
      isSpeaking: false,
      currentInput: "",
    }),
}));
