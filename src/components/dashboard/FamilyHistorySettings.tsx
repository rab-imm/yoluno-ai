import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ChildProfile {
  id: string;
  name: string;
  age: number;
}

interface AccessSetting {
  child_id: string;
  is_enabled: boolean;
  age_restriction: 'all' | 'age_8_plus' | 'age_12_plus';
}

interface Subscription {
  storage_limit_mb: number;
  storage_used_mb: number;
  transcription_limit_minutes: number;
  transcription_used_minutes: number;
  subscription_type: string;
}

export const FamilyHistorySettings = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [accessSettings, setAccessSettings] = useState<Record<string, AccessSetting>>({});
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch children
      const { data: childrenData } = await supabase
        .from('child_profiles')
        .select('id, name, age')
        .eq('parent_id', user.id);

      setChildren(childrenData || []);

      // Fetch access settings
      const { data: accessData } = await supabase
        .from('family_history_access')
        .select('child_id, is_enabled, age_restriction')
        .eq('parent_id', user.id);

      const accessMap: Record<string, AccessSetting> = {};
      accessData?.forEach(setting => {
        accessMap[setting.child_id] = setting;
      });
      setAccessSettings(accessMap);

      // Fetch subscription
      const { data: subData } = await supabase
        .from('parent_subscriptions')
        .select('*')
        .eq('parent_id', user.id)
        .eq('status', 'active')
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAccessSetting = async (childId: string, field: 'is_enabled' | 'age_restriction', value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentSetting = accessSettings[childId];

      if (currentSetting) {
        const { error } = await supabase
          .from('family_history_access')
          .update({ [field]: value })
          .eq('child_id', childId)
          .eq('parent_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('family_history_access')
          .insert({
            parent_id: user.id,
            child_id: childId,
            [field]: value
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Access settings updated"
      });

      fetchData();
    } catch (error) {
      console.error('Error updating access:', error);
      toast({
        title: "Error",
        description: "Failed to update access settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  const storagePercent = subscription 
    ? (subscription.storage_used_mb / subscription.storage_limit_mb) * 100 
    : 0;
  const transcriptionPercent = subscription
    ? (subscription.transcription_used_minutes / subscription.transcription_limit_minutes) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Subscription Usage */}
      {subscription && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscription Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Storage</Label>
                  <span className="text-sm text-muted-foreground">
                    {subscription.storage_used_mb.toFixed(1)} / {subscription.storage_limit_mb} MB
                  </span>
                </div>
                <Progress value={storagePercent} className="h-2" />
                {storagePercent > 80 && (
                  <p className="text-sm text-orange-600 mt-1">
                    {storagePercent >= 100 ? 'Storage quota reached!' : 'Storage quota almost full'}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Transcription Minutes (Monthly)</Label>
                  <span className="text-sm text-muted-foreground">
                    {subscription.transcription_used_minutes.toFixed(1)} / {subscription.transcription_limit_minutes} min
                  </span>
                </div>
                <Progress value={transcriptionPercent} className="h-2" />
                {transcriptionPercent > 80 && (
                  <p className="text-sm text-orange-600 mt-1">
                    {transcriptionPercent >= 100 ? 'Transcription quota reached!' : 'Transcription quota almost full'}
                  </p>
                )}
              </div>
            </div>

            {(storagePercent > 90 || transcriptionPercent > 90) && (
              <Button className="w-full mt-4">Upgrade Plan</Button>
            )}
          </div>
        </Card>
      )}

      {/* Child Access Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Child Access Control</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Control which children can access family history and what content is appropriate for their age.
        </p>

        {children.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No child profiles yet. Add a child to configure access.
          </p>
        ) : (
          <div className="space-y-4">
            {children.map((child) => {
              const setting = accessSettings[child.id] || {
                is_enabled: false,
                age_restriction: 'all'
              };

              return (
                <div key={child.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{child.name}</p>
                    <p className="text-sm text-muted-foreground">Age {child.age}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`enable-${child.id}`}>Enable</Label>
                      <Switch
                        id={`enable-${child.id}`}
                        checked={setting.is_enabled}
                        onCheckedChange={(checked) => 
                          updateAccessSetting(child.id, 'is_enabled', checked)
                        }
                      />
                    </div>

                    {setting.is_enabled && (
                      <Select
                        value={setting.age_restriction}
                        onValueChange={(value) => 
                          updateAccessSetting(child.id, 'age_restriction', value)
                        }
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Content</SelectItem>
                          <SelectItem value="age_8_plus">Age 8+</SelectItem>
                          <SelectItem value="age_12_plus">Age 12+</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
