import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Star, Users, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface JourneyShareManagerProps {
  journeyId: string;
  journeyTitle: string;
  allowSharing: boolean;
  onSharingToggle: (enabled: boolean) => void;
}

interface ShareStats {
  downloads: number;
  rating: number | null;
  shares: number;
}

export function JourneyShareManager({
  journeyId,
  journeyTitle,
  allowSharing,
  onSharingToggle,
}: JourneyShareManagerProps) {
  const [stats, setStats] = useState<ShareStats>({ downloads: 0, rating: null, shares: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allowSharing) {
      loadShareStats();
    }
  }, [journeyId, allowSharing]);

  const loadShareStats = async () => {
    try {
      const { data, error } = await supabase
        .from("journey_shares")
        .select("download_count, rating")
        .eq("journey_id", journeyId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setStats({
          downloads: data.download_count || 0,
          rating: data.rating,
          shares: 1,
        });
      }
    } catch (error) {
      console.error("Error loading share stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSharing = async (enabled: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (enabled) {
        // Create share entry
        const { error } = await supabase
          .from("journey_shares")
          .insert({
            journey_id: journeyId,
            shared_by_parent_id: user.id,
            privacy_level: "public",
          });

        if (error) throw error;
        toast.success("Journey shared with community! 🎉");
      } else {
        // Remove share entry
        const { error } = await supabase
          .from("journey_shares")
          .delete()
          .eq("journey_id", journeyId);

        if (error) throw error;
        toast.success("Journey unshared");
      }

      onSharingToggle(enabled);
      if (enabled) loadShareStats();
    } catch (error) {
      console.error("Error toggling sharing:", error);
      toast.error("Failed to update sharing");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Community Sharing</CardTitle>
            <CardDescription>
              Help other families by sharing "{journeyTitle}"
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="sharing"
              checked={allowSharing}
              onCheckedChange={handleToggleSharing}
            />
            <Label htmlFor="sharing" className="sr-only">
              Enable sharing
            </Label>
            {allowSharing ? (
              <Eye className="h-4 w-4 text-primary" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {allowSharing && !loading && (
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Download className="h-5 w-5 text-primary" />
                {stats.downloads}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Downloads</p>
            </div>

            {stats.rating && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  {stats.rating.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Rating</p>
              </div>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Users className="h-5 w-5 text-primary" />
                {stats.shares}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Families</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <Share2 className="h-3 w-3 inline mr-1" />
              Your journey is helping other families build positive habits!
            </p>
          </div>
        </CardContent>
      )}

      {!allowSharing && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Enable sharing to let other families discover and use this journey template.
            Your child's personal progress will remain private.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
