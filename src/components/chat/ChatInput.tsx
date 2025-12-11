/**
 * Chat Input Component
 *
 * Message input area with send button.
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  onSend,
  isDisabled = false,
  placeholder = 'Type a message...',
  maxLength = 500,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording with Web Speech API
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2 rounded-2xl border bg-card p-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          className="min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0"
          rows={1}
        />

        <div className="flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={toggleRecording}
            disabled={isDisabled}
            className={cn(
              'shrink-0',
              isRecording && 'text-destructive'
            )}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={isDisabled || !message.trim()}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isNearLimit && (
        <span className={cn(
          'text-xs text-right',
          remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'
        )}>
          {remainingChars} characters remaining
        </span>
      )}
    </div>
  );
}
