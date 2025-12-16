import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

interface FamilyPhoto {
  id: string;
  image_url: string;
  ai_caption: string | null;
  date_taken: string | null;
  description: string | null;
  created_at: string;
}

export const FamilyPhotoLibrary = () => {
  const [photos, setPhotos] = useState<FamilyPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_photos')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (!base64) throw new Error("Failed to read file");

        // Call edge function to process photo
        const { data, error } = await supabase.functions.invoke('process-family-photo', {
          body: {
            imageBase64: base64,
            fileName: file.name,
            parentId: user.id
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Photo uploaded and processed successfully"
        });

        fetchPhotos();
      };
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  if (loading) {
    return <div className="text-center py-8">Loading photos...</div>;
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        {uploading ? (
          <p className="text-muted-foreground">Processing photo...</p>
        ) : isDragActive ? (
          <p className="text-primary font-medium">Drop the photo here</p>
        ) : (
          <>
            <p className="text-foreground font-medium mb-2">Drop photos here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              AI will automatically generate captions for your family photos
            </p>
          </>
        )}
      </div>

      {photos.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
          <p className="text-muted-foreground">
            Upload family photos to preserve memories and let AI help you organize them.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={photo.image_url}
                  alt={photo.ai_caption || "Family photo"}
                  className="w-full h-full object-cover"
                />
              </div>
              {photo.ai_caption && (
                <div className="p-3">
                  <p className="text-sm line-clamp-2">{photo.ai_caption}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground text-center">
        {photos.length} photo{photos.length !== 1 ? 's' : ''} in your library
      </p>
    </div>
  );
};
