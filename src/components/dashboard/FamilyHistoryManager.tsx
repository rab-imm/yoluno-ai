import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyTreeBuilder } from "./FamilyTreeBuilder";
import { FamilyStoryArchive } from "./FamilyStoryArchive";
import { FamilyPhotoLibrary } from "./FamilyPhotoLibrary";
import { FamilyHistorySettings } from "./FamilyHistorySettings";
import { FamilyTimeline } from "./family/FamilyTimeline";
import { FamilyEventsManager } from "./family/FamilyEventsManager";

export const FamilyHistoryManager = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Family History</h2>
        <p className="text-muted-foreground mt-2">
          Build your family tree, share stories, and preserve memories for your children to discover.
        </p>
      </div>

      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tree">Tree</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="mt-6">
          <FamilyTreeBuilder />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <FamilyTimeline />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <FamilyEventsManager />
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <FamilyStoryArchive />
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <FamilyPhotoLibrary />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <FamilyHistorySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
