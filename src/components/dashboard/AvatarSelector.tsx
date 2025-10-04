import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const AVATARS = [
  { emoji: "🤖", name: "Robot" },
  { emoji: "🦄", name: "Unicorn" },
  { emoji: "🐉", name: "Dragon" },
  { emoji: "🚀", name: "Rocket" },
  { emoji: "🦖", name: "Dinosaur" },
  { emoji: "🐱", name: "Cat" },
  { emoji: "🐶", name: "Dog" },
  { emoji: "🦊", name: "Fox" },
  { emoji: "🐼", name: "Panda" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐸", name: "Frog" },
  { emoji: "🐙", name: "Octopus" },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Choose Buddy Avatar</Label>
      <div className="grid grid-cols-6 gap-2">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.emoji}
            onClick={() => onSelect(avatar.emoji)}
            className={`
              aspect-square rounded-xl flex items-center justify-center text-3xl
              transition-all duration-200 hover:scale-110
              ${
                selectedAvatar === avatar.emoji
                  ? "bg-child-primary shadow-lg ring-2 ring-child-primary ring-offset-2"
                  : "bg-secondary hover:bg-secondary/80"
              }
            `}
            title={avatar.name}
          >
            {avatar.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
