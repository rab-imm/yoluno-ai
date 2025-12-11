/**
 * Chat Message Component
 *
 * Individual message bubble in the chat interface.
 */

import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/domain';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  message: ChatMessageType;
  avatarUrl?: string;
  childName?: string;
}

export function ChatMessage({ message, avatarUrl, childName }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarFallback className="bg-child-primary/20 text-child-primary">
              {childName?.[0] ?? 'U'}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src={avatarUrl} alt="AI Assistant" />
            <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2',
          isUser
            ? 'bg-child-primary text-white'
            : 'bg-muted'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        <span
          className={cn(
            'mt-1 block text-xs',
            isUser ? 'text-white/70' : 'text-muted-foreground'
          )}
        >
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
