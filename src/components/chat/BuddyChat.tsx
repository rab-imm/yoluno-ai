/**
 * Buddy Chat Component
 *
 * Main buddy chat interface for children.
 * Uses buddy chat service with AI-powered conversations.
 */

import { useRef, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useBuddyMessages, useChatBuddy, useSendBuddyMessage } from '@/hooks/queries/useBuddyChat';
import { queryKeys } from '@/hooks/queries/keys';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatAvatar } from './ChatAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { AvatarExpression } from '@/types/domain';
import type { BuddyMessage } from '@/services/buddyChat';

interface BuddyChatProps {
  childId: string;
  childName: string;
}

export function BuddyChat({ childId, childName }: BuddyChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [avatarExpression, setAvatarExpression] = useState<AvatarExpression>('neutral');
  const queryClient = useQueryClient();

  // Fetch buddy data
  const { data: buddy, isLoading: buddyLoading } = useChatBuddy(childId);

  // Fetch messages (polls every 3 seconds)
  const { data: messages = [], isLoading: messagesLoading } = useBuddyMessages(childId);

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useSendBuddyMessage();

  // Real-time subscription for new messages
  useEffect(() => {
    if (!childId) return;

    const channel = supabase
      .channel(`buddy-messages:${childId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buddy_messages',
          filter: `child_profile_id=eq.${childId}`,
        },
        (payload) => {
          // Invalidate queries to refetch with new message
          queryClient.invalidateQueries({
            queryKey: queryKeys.buddyChat.messages(childId),
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.buddyChat.buddy(childId),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [childId, queryClient]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update avatar expression based on buddy's state
  useEffect(() => {
    if (isSending) {
      setAvatarExpression('thinking');
    } else {
      setAvatarExpression('happy');
    }
  }, [isSending]);

  const handleSend = (content: string) => {
    sendMessage({
      message: content,
      childId,
    });
  };

  // Check for recent red flags
  const hasRedFlag = messages.some(
    (msg) =>
      msg.safety_level === 'red' &&
      new Date(msg.created_at).getTime() > Date.now() - 5 * 60 * 1000 // Last 5 minutes
  );

  const isLoading = buddyLoading || messagesLoading;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Avatar section */}
      <div className="flex flex-col items-center gap-2 py-4">
        <ChatAvatar
          imageUrl={buddy?.buddy_avatar_url || undefined}
          expression={avatarExpression}
          size="lg"
        />
        <h3 className="text-lg font-semibold">{buddy?.buddy_name || 'Buddy'}</h3>

        {hasRedFlag && (
          <Alert variant="destructive" className="mx-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              A parent has been notified about your recent conversation.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title={`Say hi to ${buddy?.buddy_name || 'your buddy'}!`}
            description="Your buddy is here to chat, play games, and answer questions."
            className="py-12"
          />
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  role: message.role === 'child' ? 'user' : 'assistant',
                  content: message.content,
                  timestamp: message.created_at,
                }}
                avatarUrl={buddy?.buddy_avatar_url || undefined}
                childName={childName}
              />
            ))}

            {isSending && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-0" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
                </div>
                <span className="text-sm">{buddy?.buddy_name || 'Buddy'} is thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="border-t bg-card p-4">
        <ChatInput
          onSend={handleSend}
          isDisabled={isSending}
          placeholder={`Chat with ${buddy?.buddy_name || 'your buddy'}...`}
          maxLength={500}
        />
      </div>
    </div>
  );
}
