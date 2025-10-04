import { BuddyAvatar } from "./BuddyAvatar";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && <BuddyAvatar size="sm" />}
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-gradient-to-r from-child-primary/10 to-child-secondary/10"
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-2xl">
          👤
        </div>
      )}
    </div>
  );
}
