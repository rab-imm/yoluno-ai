import { BuddyAvatar } from "./BuddyAvatar";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    created_at?: string;
    photos?: string[];
  };
  childAvatar?: string;
  customAvatarUrl?: string;
}

export function ChatMessage({ message, childAvatar = "🤖", customAvatarUrl }: ChatMessageProps) {
  const isUser = message.role === "user";
  const timestamp = message.created_at 
    ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  
  const [photoUrls, setPhotoUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (message.photos && message.photos.length > 0) {
      loadPhotos();
    }
  }, [message.photos]);

  const loadPhotos = async () => {
    if (!message.photos) return;
    
    const urls: { [key: string]: string } = {};
    for (const photoId of message.photos) {
      const { data } = await supabase
        .from('family_photos')
        .select('image_url')
        .eq('id', photoId)
        .single();
      
      if (data?.image_url) {
        urls[photoId] = data.image_url;
      }
    }
    setPhotoUrls(urls);
  };

  // Remove [PHOTO:uuid] tags from display text
  const displayContent = message.content.replace(/\[PHOTO:[^\]]+\]/g, '').trim();

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
          <p className="text-base leading-relaxed whitespace-pre-wrap">{displayContent}</p>
          
          {/* Display family photos inline */}
          {message.photos && message.photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.photos.map((photoId) => (
                photoUrls[photoId] && (
                  <img 
                    key={photoId}
                    src={photoUrls[photoId]}
                    alt="Family photo"
                    className="rounded-lg w-32 h-32 object-cover border-2 border-primary/20"
                  />
                )
              ))}
            </div>
          )}
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
