import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  type: "hat" | "glasses" | "background";
  unlockRequirement: {
    type: "badge" | "streak";
    value: number | string;
  };
  description: string;
}

const AVAILABLE_ACCESSORIES: Accessory[] = [
  {
    id: "wizard-hat",
    name: "Wizard Hat",
    emoji: "🧙‍♂️",
    type: "hat",
    unlockRequirement: { type: "badge", value: "question_master" },
    description: "Unlocked with Question Master badge",
  },
  {
    id: "cool-shades",
    name: "Cool Shades",
    emoji: "😎",
    type: "glasses",
    unlockRequirement: { type: "streak", value: 7 },
    description: "Unlocked with 7-day streak",
  },
  {
    id: "crown",
    name: "Royal Crown",
    emoji: "👑",
    type: "hat",
    unlockRequirement: { type: "badge", value: "explorer" },
    description: "Unlocked with Explorer badge",
  },
  {
    id: "star-shades",
    name: "Star Glasses",
    emoji: "🌟",
    type: "glasses",
    unlockRequirement: { type: "badge", value: "story_lover" },
    description: "Unlocked with Story Lover badge",
  },
  {
    id: "rainbow-bg",
    name: "Rainbow Aura",
    emoji: "🌈",
    type: "background",
    unlockRequirement: { type: "streak", value: 14 },
    description: "Unlocked with 14-day streak",
  },
  {
    id: "sparkle-bg",
    name: "Sparkle Effect",
    emoji: "✨",
    type: "background",
    unlockRequirement: { type: "badge", value: "curious_beginner" },
    description: "Unlocked with Curious Beginner badge",
  },
];

interface AccessoriesManagerProps {
  childId: string;
  streakDays: number;
}

export function AccessoriesManager({ childId, streakDays }: AccessoriesManagerProps) {
  const [unlockedAccessories, setUnlockedAccessories] = useState<Set<string>>(new Set());
  const [equippedAccessories, setEquippedAccessories] = useState<Set<string>>(new Set());
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [childId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load badges
      const { data: badgesData } = await supabase
        .from("child_badges")
        .select("badge_type")
        .eq("child_id", childId);

      if (badgesData) {
        setBadges(badgesData.map((b) => b.badge_type));
      }

      // Load unlocked accessories
      const { data: accessoriesData } = await supabase
        .from("avatar_accessories")
        .select("*")
        .eq("child_id", childId);

      if (accessoriesData) {
        setUnlockedAccessories(new Set(accessoriesData.map((a) => a.accessory_id)));
        setEquippedAccessories(
          new Set(accessoriesData.filter((a) => a.is_equipped).map((a) => a.accessory_id))
        );
      }
    } catch (error) {
      console.error("Error loading accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfUnlocked = (accessory: Accessory): boolean => {
    if (unlockedAccessories.has(accessory.id)) return true;

    const { type, value } = accessory.unlockRequirement;
    if (type === "badge") {
      return badges.includes(value as string);
    } else if (type === "streak") {
      return streakDays >= (value as number);
    }
    return false;
  };

  const unlockAccessory = async (accessory: Accessory) => {
    if (!checkIfUnlocked(accessory)) {
      toast.error("Requirements not met yet!");
      return;
    }

    try {
      const { error } = await supabase.from("avatar_accessories").insert({
        child_id: childId,
        accessory_type: accessory.type,
        accessory_id: accessory.id,
        is_equipped: false,
      });

      if (error) throw error;

      setUnlockedAccessories((prev) => new Set([...prev, accessory.id]));
      toast.success(`🎉 ${accessory.name} unlocked!`);
    } catch (error: any) {
      console.error("Error unlocking accessory:", error);
      toast.error("Failed to unlock accessory");
    }
  };

  const toggleEquip = async (accessory: Accessory) => {
    if (!unlockedAccessories.has(accessory.id)) return;

    const isCurrentlyEquipped = equippedAccessories.has(accessory.id);

    try {
      const { error } = await supabase
        .from("avatar_accessories")
        .update({ is_equipped: !isCurrentlyEquipped })
        .eq("child_id", childId)
        .eq("accessory_id", accessory.id);

      if (error) throw error;

      if (isCurrentlyEquipped) {
        setEquippedAccessories((prev) => {
          const next = new Set(prev);
          next.delete(accessory.id);
          return next;
        });
        toast.success(`${accessory.name} unequipped`);
      } else {
        setEquippedAccessories((prev) => new Set([...prev, accessory.id]));
        toast.success(`${accessory.name} equipped!`);
      }
    } catch (error: any) {
      console.error("Error toggling accessory:", error);
      toast.error("Failed to update accessory");
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading accessories...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-child-primary" />
        Avatar Accessories
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Unlock cool accessories by earning badges and maintaining streaks!
      </p>

      <div className="space-y-2">
        {AVAILABLE_ACCESSORIES.map((accessory) => {
          const isUnlocked = unlockedAccessories.has(accessory.id);
          const canUnlock = checkIfUnlocked(accessory);
          const isEquipped = equippedAccessories.has(accessory.id);

          return (
            <div
              key={accessory.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${isEquipped ? "bg-child-primary/10 border-child-primary" : "bg-secondary/50"}
                transition-all
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{accessory.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{accessory.name}</span>
                    {isEquipped && (
                      <Badge variant="default" className="h-5 text-xs">
                        Equipped
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{accessory.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isUnlocked && !canUnlock && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                {!isUnlocked && canUnlock && (
                  <Button
                    size="sm"
                    variant="playful"
                    onClick={() => unlockAccessory(accessory)}
                  >
                    Unlock
                  </Button>
                )}
                {isUnlocked && (
                  <Button
                    size="sm"
                    variant={isEquipped ? "secondary" : "playful"}
                    onClick={() => toggleEquip(accessory)}
                  >
                    {isEquipped ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Equipped
                      </>
                    ) : (
                      "Equip"
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}