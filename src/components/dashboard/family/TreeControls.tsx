import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Minimize2,
  RotateCcw,
  Move
} from "lucide-react";
import { useState, useEffect } from "react";

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onResetZoom: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
}

export const TreeControls = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetZoom,
  onToggleFullscreen,
  isFullscreen,
  currentZoom,
  onZoomChange,
}: TreeControlsProps) => {
  const [zoomValue, setZoomValue] = useState([currentZoom * 100]);

  useEffect(() => {
    setZoomValue([currentZoom * 100]);
  }, [currentZoom]);

  const handleZoomSliderChange = (value: number[]) => {
    setZoomValue(value);
    onZoomChange(value[0] / 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        onZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        onZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        onResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onZoomIn, onZoomOut, onResetZoom]);

  return (
    <div className="flex flex-col gap-2 bg-card border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onFitView}
          title="Fit to screen (Ctrl+0)"
        >
          <Move className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomIn}
          title="Zoom in (Ctrl/Cmd + +)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomOut}
          title="Zoom out (Ctrl/Cmd + -)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onResetZoom}
          title="Reset zoom (Ctrl/Cmd + 0)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onToggleFullscreen}
          title="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {Math.round(zoomValue[0])}%
        </span>
        <Slider
          value={zoomValue}
          onValueChange={handleZoomSliderChange}
          min={50}
          max={150}
          step={5}
          className="flex-1"
        />
      </div>
    </div>
  );
};
