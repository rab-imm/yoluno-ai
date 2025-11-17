import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Shield, Heart } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function WelcomeDialog({ open, onComplete }: WelcomeDialogProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="w-12 h-12 text-child-primary mx-auto mb-4" />,
      title: "Welcome to Yoluno AI! 🎉",
      description: "A safe, fun learning companion for your children. Let's get you started!",
    },
    {
      icon: <Users className="w-12 h-12 text-child-primary mx-auto mb-4" />,
      title: "Create Child Profiles",
      description: "Set up a profile for each child with their name, age, and favorite buddy avatar.",
    },
    {
      icon: <Shield className="w-12 h-12 text-child-primary mx-auto mb-4" />,
      title: "Choose Safe Topics",
      description: "Select which topics your child can explore. We have pre-made packs or you can customize!",
    },
    {
      icon: <Heart className="w-12 h-12 text-child-primary mx-auto mb-4" />,
      title: "Track Progress",
      description: "See what your child is learning, their achievements, and daily streaks. Learning has never been this fun!",
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{currentStep.title}</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          {currentStep.icon}
          <DialogDescription className="text-center text-base">
            {currentStep.description}
          </DialogDescription>
        </div>
        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1" variant="playful">
            {isLastStep ? "Get Started!" : "Next"}
          </Button>
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === step ? "bg-child-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
