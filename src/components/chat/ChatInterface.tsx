import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "./ChatMessage";
import { BuddyAvatar } from "./BuddyAvatar";

interface ChatInterfaceProps {
  childId: string;
  childName: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function ChatInterface({ childId, childName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    sendWelcomeMessage();
  }, [childId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: true });

    if (data && data.length > 0) {
      setMessages(data);
    }
  };

  const sendWelcomeMessage = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("child_id", childId)
      .limit(1);

    if (!data || data.length === 0) {
      const welcomeMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: `Hi ${childName}! 👋 I'm your AI Buddy! I can talk to you about all the fun topics your parent picked for us. What would you like to chat about today?`,
        created_at: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Save user message
    await supabase.from("chat_messages").insert({
      child_id: childId,
      role: "user",
      content: userMessage.content,
    });

    try {
      // Call the AI chat function
      const { data, error } = await supabase.functions.invoke("child-chat", {
        body: {
          childId,
          message: userMessage.content,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      await supabase.from("chat_messages").insert({
        child_id: childId,
        role: "assistant",
        content: assistantMessage.content,
      });
    } catch (error: any) {
      toast.error("Sorry, I couldn't respond right now. Please try again!");
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto overflow-hidden">
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <BuddyAvatar size="sm" />
              <div className="bg-gradient-to-r from-child-primary/10 to-child-secondary/10 rounded-2xl p-4 animate-pulse">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 bg-background/95 backdrop-blur">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="text-lg rounded-2xl"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              variant="playful"
              size="lg"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
