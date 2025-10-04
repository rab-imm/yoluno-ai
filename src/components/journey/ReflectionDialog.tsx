import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReflectionDialogProps {
  open: boolean;
  onClose: () => void;
  stepId: string;
  missionTitle: string;
  childName: string;
}

export function ReflectionDialog({
  open,
  onClose,
  stepId,
  missionTitle,
  childName,
}: ReflectionDialogProps) {
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!reflection.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("journey_steps")
        .update({ reflection: reflection.trim() })
        .eq("id", stepId);

      if (error) throw error;

      toast.success("Reflection saved! 💙");
      setReflection("");
      onClose();
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Failed to save reflection");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>How did it feel?</DialogTitle>
          <DialogDescription>
            Tell me about completing: "{missionTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reflection">Your thoughts</Label>
            <Textarea
              id="reflection"
              placeholder={`What did you learn? How did it make you feel?`}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSave} disabled={!reflection.trim() || saving}>
            {saving ? "Saving..." : "Save Reflection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
