import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChildProfileCardProps {
  child: any;
  onRefresh: () => void;
}

export function ChildProfileCard({ child, onRefresh }: ChildProfileCardProps) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${child.name}'s profile?`)) {
      return;
    }

    const { error } = await supabase
      .from("child_profiles")
      .delete()
      .eq("id", child.id);

    if (error) {
      toast.error("Failed to delete profile");
      return;
    }

    toast.success("Profile deleted");
    onRefresh();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-child-primary to-child-secondary flex items-center justify-center text-4xl">
            {child.avatar || "👦"}
          </div>
          <h3 className="font-semibold text-lg">{child.name}</h3>
          <p className="text-sm text-muted-foreground">Age {child.age}</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => navigate(`/child/${child.id}`)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
