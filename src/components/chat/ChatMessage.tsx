import { BuddyAvatar } from "./BuddyAvatar";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    created_at?: string;
  };
  childAvatar?: string;
  customAvatarUrl?: string;
}

export function ChatMessage({ message, childAvatar = "🤖", customAvatarUrl }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = message.created_at 
    ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <BuddyAvatar 
          size="sm" 
          avatar={childAvatar} 
          customAvatarUrl={customAvatarUrl}
        />
      )}
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={`rounded-2xl p-4 ${
            isUser
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-gradient-to-r from-child-primary/10 to-child-secondary/10"
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        {timestamp && (
          <span className={`text-xs text-muted-foreground ${isUser ? "text-right" : "text-left"}`}>
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-2xl">
          👤
        </div>
      )}
    </div>
  );
}
