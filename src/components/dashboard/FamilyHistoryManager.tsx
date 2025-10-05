import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FamilyTreeBuilder } from "./FamilyTreeBuilder";
import { FamilyStoryArchive } from "./FamilyStoryArchive";
import { FamilyPhotoLibrary } from "./FamilyPhotoLibrary";
import { FamilyHistorySettings } from "./FamilyHistorySettings";

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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tree">Family Tree</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tree" className="mt-6">
          <FamilyTreeBuilder />
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
