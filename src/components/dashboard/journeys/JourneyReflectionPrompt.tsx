import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface JourneyReflectionPromptProps {
  journeyId: string;
  childName: string;
  onClose: () => void;
}

export function JourneyReflectionPrompt({
  journeyId,
  childName,
  onClose,
}: JourneyReflectionPromptProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [sending, setSending] = useState(false);

  const defaultPrompts = [
    `What's been your favorite mission so far?`,
    `How do you feel about the journey?`,
    `What have you learned from these activities?`,
    `Which day was the most fun?`,
  ];

  const sendPrompt = async (prompt: string) => {
    setSending(true);
    try {
      // In a real implementation, this would queue a reflection prompt
      // that Buddy would ask during the next chat session
      
      // For now, we'll just show a success message
      toast.success(`Reflection prompt queued for ${childName}'s next session`);
      onClose();
    } catch (error) {
      console.error("Error sending prompt:", error);
      toast.error("Failed to send reflection prompt");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Reflection Prompt</DialogTitle>
          <DialogDescription>
            Choose a prompt for Buddy to ask {childName} about their journey progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Quick Prompts</Label>
            <div className="grid gap-2">
              {defaultPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3"
                  onClick={() => sendPrompt(prompt)}
                  disabled={sending}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="flex-1">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom Prompt</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Write your own reflection question..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => sendPrompt(customPrompt)}
            disabled={!customPrompt.trim() || sending}
          >
            {sending ? "Sending..." : "Send Custom Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
