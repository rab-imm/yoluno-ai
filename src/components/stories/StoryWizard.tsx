import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { validateCharacterName } from "@/lib/storyValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StoryWizardProps {
  childId: string;
  childName: string;
  childAge: number;
  onComplete: (storyData: StoryWizardData) => void;
  onCancel: () => void;
}

export interface StoryWizardData {
  theme: string;
  characters: { name: string; role: string }[];
  mood: string;
  values: string[];
  narrationVoice: string;
  illustrationStyle: string;
  storyLength: string;
}

const THEMES = [
  { name: "Space", emoji: "🚀", description: "Adventures among the stars" },
  { name: "Dinosaurs", emoji: "🦕", description: "Journey to prehistoric times" },
  { name: "Animals", emoji: "🦁", description: "Tales of amazing creatures" },
  { name: "Friendship", emoji: "🤝", description: "Stories about making friends" },
  { name: "Adventure", emoji: "⛰️", description: "Exciting quests and explorations" },
  { name: "Nature", emoji: "🌳", description: "Wonders of the natural world" },
  { name: "Ocean", emoji: "🌊", description: "Underwater adventures" },
  { name: "Magic", emoji: "✨", description: "Enchanted worlds" },
];

const MOODS = [
  { value: "funny", label: "Funny 😄", description: "Light-hearted and giggly" },
  { value: "gentle", label: "Gentle 🌙", description: "Calm and soothing" },
  { value: "moral", label: "Moral Lesson 📚", description: "Teaching moment" },
  { value: "sweet", label: "Short & Sweet ⏱️", description: "Quick and cozy" },
];

const VALUES = ["Kindness", "Curiosity", "Teamwork", "Sharing", "Bravery", "Honesty"];

const VOICES = [
  { value: "alloy", label: "Warm Female (Alloy)" },
  { value: "nova", label: "Gentle Female (Nova)" },
  { value: "shimmer", label: "Soft Female (Shimmer)" },
];

const ILLUSTRATION_STYLES = [
  { value: "cartoon", label: "Cartoon", description: "Colorful and playful" },
  { value: "watercolor", label: "Watercolor", description: "Soft and dreamy" },
  { value: "storybook", label: "Storybook", description: "Classic illustrations" },
  { value: "minimalist", label: "Minimalist", description: "Clean and modern" },
];

export function StoryWizard({ childId, childName, childAge, onComplete, onCancel }: StoryWizardProps) {
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState<string>("");
  const [wizardData, setWizardData] = useState<StoryWizardData>({
    theme: "",
    characters: [{ name: childName, role: "hero" }],
    mood: "gentle",
    values: ["Kindness"],
    narrationVoice: "alloy",
    illustrationStyle: "cartoon",
    storyLength: "medium",
  });

  const updateData = (updates: Partial<StoryWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    setValidationError("");
    
    switch (step) {
      case 1: 
        if (wizardData.theme === "") {
          setValidationError("Please select a theme");
          return false;
        }
        return true;
      case 2:
        if (wizardData.characters.length === 0 || wizardData.characters[0].name === "") {
          setValidationError("Hero name is required");
          return false;
        }
        // Validate character names
        for (const char of wizardData.characters) {
          const validation = validateCharacterName(char.name);
          if (!validation.valid) {
            setValidationError(validation.error || "Invalid character name");
            return false;
          }
        }
        return true;
      case 3:
        if (wizardData.mood === "" || wizardData.values.length === 0) {
          setValidationError("Please select a mood and at least one value");
          return false;
        }
        return true;
      case 4: 
        return true;
      default: 
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1);
    }
  };

  const handleComplete = () => {
    if (canProceed()) {
      onComplete(wizardData);
    }
  };

  const toggleValue = (value: string) => {
    const newValues = wizardData.values.includes(value)
      ? wizardData.values.filter(v => v !== value)
      : [...wizardData.values, value];
    updateData({ values: newValues });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles 
            className="w-5 h-5" 
            style={{ color: 'hsl(var(--story-magic))' }}
          />
          Create Tonight's Story
        </CardTitle>
        <CardDescription>
          Step {step} of 4 - Let's create a magical bedtime story for {childName}
        </CardDescription>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className="h-2 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: s <= step ? 'hsl(var(--story-magic))' : 'hsl(var(--muted))'
              }}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Label className="text-lg">Choose a Theme</Label>
            <p className="text-sm text-muted-foreground">What kind of adventure tonight?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {THEMES.map(theme => (
                <Button
                  key={theme.name}
                  variant={wizardData.theme === theme.name ? "default" : "outline"}
                  className="h-auto flex-col py-4 gap-2"
                  onClick={() => updateData({ theme: theme.name })}
                >
                  <span className="text-3xl">{theme.emoji}</span>
                  <span className="font-semibold">{theme.name}</span>
                  <span className="text-xs text-muted-foreground">{theme.description}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Label className="text-lg">Add Characters</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-name">Hero Name *</Label>
                <Input
                  id="hero-name"
                  value={wizardData.characters[0]?.name || ""}
                  onChange={(e) => {
                    const newChars = [...wizardData.characters];
                    newChars[0] = { ...newChars[0], name: e.target.value.slice(0, 50) };
                    updateData({ characters: newChars });
                    setValidationError("");
                  }}
                  placeholder={childName}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, spaces, hyphens, and apostrophes only (max 50 characters)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sidekick">Sidekick (optional)</Label>
                <Input
                  id="sidekick"
                  value={wizardData.characters[1]?.name || ""}
                  onChange={(e) => {
                    const newChars = [...wizardData.characters];
                    const value = e.target.value.slice(0, 50);
                    if (value) {
                      newChars[1] = { name: value, role: "sidekick" };
                    } else {
                      newChars.splice(1, 1);
                    }
                    updateData({ characters: newChars });
                    setValidationError("");
                  }}
                  placeholder="favorite toy, sibling, or pet"
                  maxLength={50}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Pick the Mood</Label>
              <RadioGroup value={wizardData.mood} onValueChange={(mood) => updateData({ mood })}>
                {MOODS.map(mood => (
                  <div key={mood.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={mood.value} id={mood.value} />
                    <Label htmlFor={mood.value} className="flex-1 cursor-pointer">
                      <div className="font-semibold">{mood.label}</div>
                      <div className="text-sm text-muted-foreground">{mood.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">Choose Values to Teach</Label>
              <div className="flex flex-wrap gap-2">
                {VALUES.map(value => (
                  <Badge
                    key={value}
                    variant={wizardData.values.includes(value) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => toggleValue(value)}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg">Narration Voice</Label>
              <Select value={wizardData.narrationVoice} onValueChange={(voice) => updateData({ narrationVoice: voice })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES.map(voice => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">Illustration Style</Label>
              <RadioGroup value={wizardData.illustrationStyle} onValueChange={(style) => updateData({ illustrationStyle: style })}>
                {ILLUSTRATION_STYLES.map(style => (
                  <div key={style.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={style.value} id={style.value} />
                    <Label htmlFor={style.value} className="flex-1 cursor-pointer">
                      <div className="font-semibold">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label className="text-lg">Story Length</Label>
              <div className="space-y-2">
                <Slider
                  value={[wizardData.storyLength === "short" ? 0 : wizardData.storyLength === "medium" ? 50 : 100]}
                  onValueChange={([value]) => {
                    const length = value < 33 ? "short" : value < 67 ? "medium" : "long";
                    updateData({ storyLength: length });
                  }}
                  max={100}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Short (~2 min)</span>
                  <span>Medium (~3 min)</span>
                  <span>Long (~5 min)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={onCancel} className="ml-auto">
            Cancel
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Story
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
