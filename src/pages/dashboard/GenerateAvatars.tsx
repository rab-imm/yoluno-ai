import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAvatarLibrary } from "@/hooks/dashboard/useAvatarLibrary";
import { BuddyAvatar } from "@/components/chat/BuddyAvatar";

export default function GenerateAvatars() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const { data: avatars = [], refetch } = useAvatarLibrary();

  const handleGenerate = async (regenerate: boolean = false) => {
    setGenerating(true);
    setProgress(0);
    setResults([]);

    try {
      toast.info("Starting avatar generation... This may take several minutes.");

      const { data, error } = await supabase.functions.invoke('generate-avatar-library', {
        body: { regenerate }
      });

      if (error) throw error;

      setResults(data.results || []);
      
      const successCount = data.results.filter((r: any) => r.status === 'success').length;
      toast.success(`Successfully generated ${successCount} Pixar-style avatars! 🎉`);
      
      // Refresh the avatar library
      await refetch();
      
    } catch (error: any) {
      console.error("Error generating avatars:", error);
      toast.error(`Failed to generate avatars: ${error.message}`);
    } finally {
      setGenerating(false);
      setProgress(100);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Avatar Library Generator</h1>
        <p className="text-muted-foreground">
          Generate 24 unique Pixar-style character avatars for the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Avatars
          </CardTitle>
          <CardDescription>
            This will generate 24 high-quality Pixar-style characters with 4 expressions each (96 total images).
            Each character will have: neutral, happy, thinking, and excited expressions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {avatars.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">
                Current Library: {avatars.length} characters available
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => handleGenerate(false)}
              disabled={generating}
              size="lg"
              className="flex-1"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Avatars...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Missing Avatars
                </>
              )}
            </Button>

            <Button
              onClick={() => handleGenerate(true)}
              disabled={generating}
              size="lg"
              variant="outline"
            >
              {generating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Regenerate All
                </>
              )}
            </Button>
          </div>

          {generating && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                This process can take 10-15 minutes. Please be patient...
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Generation Results:</h3>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`text-sm p-2 rounded ${
                      result.status === 'success'
                        ? 'bg-green-50 text-green-900'
                        : result.status === 'skipped'
                        ? 'bg-blue-50 text-blue-900'
                        : 'bg-red-50 text-red-900'
                    }`}
                  >
                    <span className="font-medium">{result.character}:</span> {result.status}
                    {result.reason && ` (${result.reason})`}
                    {result.error && ` - ${result.error}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {avatars.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avatar Library Preview</CardTitle>
            <CardDescription>
              Preview of all generated Pixar-style characters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {avatars.map((avatar) => (
                <div key={avatar.id} className="space-y-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-2">
                    <img
                      src={avatar.avatar_neutral}
                      alt={avatar.character_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium truncate">{avatar.character_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{avatar.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
