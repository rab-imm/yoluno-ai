import { useParams, Navigate } from "react-router-dom";
import { useChildProfiles } from "@/hooks/dashboard/useChildProfiles";
import { StoryLibrary } from "@/components/dashboard/stories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stories() {
  const { childId } = useParams();
  const { children, isLoading } = useChildProfiles();

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!childId) {
    return <Navigate to="/dashboard" replace />;
  }

  const child = children.find((c) => c.id === childId);

  if (!child) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Child Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a child from the sidebar.</p>
        </CardContent>
      </Card>
    );
  }

  return <StoryLibrary childId={child.id} childName={child.name} />;
}
