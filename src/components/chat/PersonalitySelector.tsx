import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PERSONALITY_MODES = [
  {
    value: "curious_explorer",
    label: "Curious Explorer",
    emoji: "🔍",
    description: "Asks follow-up questions and loves to explore topics deeply",
  },
  {
    value: "patient_teacher",
    label: "Patient Teacher",
    emoji: "📚",
    description: "Explains step-by-step with clear examples",
  },
  {
    value: "playful_friend",
    label: "Playful Friend",
    emoji: "🎉",
    description: "Uses jokes, games, and silly examples to make learning fun",
  },
];

interface PersonalitySelectorProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export function PersonalitySelector({ selectedMode, onModeChange }: PersonalitySelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Buddy Personality</Label>
      <RadioGroup value={selectedMode} onValueChange={onModeChange}>
        <div className="grid gap-3">
          {PERSONALITY_MODES.map((mode) => (
            <Card
              key={mode.value}
              className={`cursor-pointer transition-all ${
                selectedMode === mode.value
                  ? "border-child-primary ring-2 ring-child-primary ring-offset-2"
                  : "hover:border-child-primary/50"
              }`}
              onClick={() => onModeChange(mode.value)}
            >
              <div className="p-4 flex items-start gap-3">
                <RadioGroupItem value={mode.value} id={mode.value} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{mode.emoji}</span>
                    <Label htmlFor={mode.value} className="cursor-pointer font-semibold">
                      {mode.label}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
