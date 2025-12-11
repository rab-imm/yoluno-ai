/**
 * Chat Context
 *
 * Provides chat session state and message handling.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { ChatMessage, AvatarExpression } from '@/types/domain';
import { generateId } from '@/lib/utils';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  sessionId: string | null;
  avatarExpression: AvatarExpression;
}

interface ChatContextValue extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setAvatarExpression: (expression: AvatarExpression) => void;
  startSession: (childId: string) => void;
  endSession: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    sessionId: null,
    avatarExpression: 'neutral',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const startSession = useCallback((childId: string) => {
    setState((prev) => ({
      ...prev,
      sessionId: generateId(),
      messages: [],
      avatarExpression: 'happy',
    }));
  }, []);

  const endSession = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState((prev) => ({
      ...prev,
      sessionId: null,
      messages: [],
      isTyping: false,
      avatarExpression: 'neutral',
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !state.sessionId) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
      avatarExpression: 'thinking',
    }));

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // TODO: Implement actual AI chat API call via Supabase Edge Function
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `I heard you say: "${content}". This is a placeholder response.`,
        timestamp: new Date(),
        safetyLevel: 'safe',
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isTyping: false,
        avatarExpression: 'happy',
      }));
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;

      setState((prev) => ({
        ...prev,
        isTyping: false,
        avatarExpression: 'neutral',
      }));
    }
  }, [state.sessionId]);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const setAvatarExpression = useCallback((expression: AvatarExpression) => {
    setState((prev) => ({
      ...prev,
      avatarExpression: expression,
    }));
  }, []);

  const value: ChatContextValue = {
    ...state,
    sendMessage,
    clearMessages,
    setAvatarExpression,
    startSession,
    endSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}

export function useChatMessages(): ChatMessage[] {
  const { messages } = useChat();
  return messages;
}

export function useIsTyping(): boolean {
  const { isTyping } = useChat();
  return isTyping;
}
