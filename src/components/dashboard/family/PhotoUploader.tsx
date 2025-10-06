import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

interface PhotoUploaderProps {
  onPhotoSelected: (file: File, croppedAreaPixels: any) => void;
  currentPhotoUrl?: string;
}

export const PhotoUploader = ({ onPhotoSelected, currentPhotoUrl }: PhotoUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    multiple: false,
  });

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = () => {
    if (selectedFile && croppedAreaPixels) {
      onPhotoSelected(selectedFile, croppedAreaPixels);
      setShowCropDialog(false);
      toast.success("Photo ready to upload");
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    setSelectedFile(null);
    setCroppedAreaPixels(null);
  };

  if (preview && !showCropDialog) {
    return (
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        <button
          onClick={clearPhoto}
          className="absolute top-1 right-1 p-1 bg-destructive/90 text-destructive-foreground rounded-full hover:bg-destructive"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground text-center px-2">
          {isDragActive ? "Drop photo" : "Add photo"}
        </p>
      </div>

      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Crop Photo
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-96 bg-muted">
            {preview && (
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Zoom:</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCropDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCrop}>Save & Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
