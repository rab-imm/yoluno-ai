import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";

interface Props {
  onComplete: () => void;
}

export const FamilyDocumentUploader = ({ onComplete }: Props) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleUpload = async () => {
    if (!file || !title) return;

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

        const { data, error } = await supabase.functions.invoke('process-family-document', {
          body: {
            documentBase64: base64,
            fileName: file.name,
            parentId: user.id,
            title,
            fileType: file.type
          }
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Document uploaded and processed successfully"
        });

        onComplete();
      };
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="doc-title">Document Title *</Label>
        <Input
          id="doc-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Birth Certificate, Family Letters"
        />
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        {file ? (
          <div>
            <p className="text-foreground font-medium mb-2">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : isDragActive ? (
          <p className="text-primary font-medium">Drop the file here</p>
        ) : (
          <>
            <p className="text-foreground font-medium mb-2">Drop document here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              Supports PDF, Word documents, and images
            </p>
          </>
        )}
      </div>

      <Button
        onClick={handleUpload}
        className="w-full"
        disabled={!file || !title || uploading}
      >
        {uploading ? "Processing..." : "Upload & Process"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Text will be extracted automatically for easy searching
      </p>
    </div>
  );
};
