import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Mic, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "./ChatMessage";
import { BuddyAvatar } from "./BuddyAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatInterfaceProps {
  childId: string;
  childName: string;
  childAvatar?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function ChatInterface({ childId, childName, childAvatar = "🤖" }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadMessages();
    sendWelcomeMessage();
    setupVoiceRecognition();
  }, [childId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const setupVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        toast.error("Voice recognition failed");
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening...");
    }
  };

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
      // Type assertion to convert database role (string) to our Message role type
      const typedMessages = data.map(msg => ({
        ...msg,
        role: msg.role as "user" | "assistant"
      }));
      setMessages(typedMessages);
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

  const clearChatHistory = async () => {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("child_id", childId);

    if (error) {
      toast.error("Failed to clear chat history");
      return;
    }

    setMessages([]);
    toast.success("Chat history cleared");
    sendWelcomeMessage();
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
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-child-primary/5 to-child-secondary/5">
          <div className="flex items-center gap-3">
            <BuddyAvatar size="sm" avatar={childAvatar} />
            <div>
              <h3 className="font-semibold">Chatting with {childName}'s Buddy</h3>
              <p className="text-xs text-muted-foreground">Always here to help!</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all messages in this conversation. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearChatHistory}>Clear</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} childAvatar={childAvatar} />
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <BuddyAvatar size="sm" avatar={childAvatar} isThinking={true} />
              <div className="bg-gradient-to-r from-child-primary/10 to-child-secondary/10 rounded-2xl p-4">
                <div className="flex gap-2 items-center">
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-child-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
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
              onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Type your message..."
              className="text-lg rounded-2xl"
              disabled={loading || isListening}
            />
            <Button
              onClick={toggleVoiceInput}
              disabled={loading}
              variant={isListening ? "destructive" : "secondary"}
              size="lg"
              title="Voice input"
            >
              <Mic className={`h-5 w-5 ${isListening ? "animate-pulse" : ""}`} />
            </Button>
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
