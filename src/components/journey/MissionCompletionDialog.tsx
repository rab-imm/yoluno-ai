import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";

interface MissionCompletionDialogProps {
  missionTitle: string;
  personalityMode: string;
  onClose: () => void;
}

export function MissionCompletionDialog({
  missionTitle,
  personalityMode,
  onClose,
}: MissionCompletionDialogProps) {
  const getMessage = () => {
    if (personalityMode === "curious_explorer") {
      return "Awesome! You earned a star! ⭐";
    } else {
      return "That's wonderful! You did great today. 💙";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <Star className="h-20 w-20 text-primary opacity-30" />
            </div>
            <Star className="h-20 w-20 text-primary fill-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">Mission Complete!</h3>
            <p className="text-muted-foreground">{missionTitle}</p>
          </div>

          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-lg font-medium">{getMessage()}</p>
          </div>

          <Button onClick={onClose} size="lg" className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
