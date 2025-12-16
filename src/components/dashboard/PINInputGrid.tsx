import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface PINInputGridProps {
  value: string;
  onChange: (pin: string) => void;
  onComplete?: (pin: string) => void;
  error?: string;
  maxLength?: number;
}

export function PINInputGrid({ value, onChange, onComplete, error, maxLength = 4 }: PINInputGridProps) {
  const handleNumberClick = (num: number) => {
    if (value.length < maxLength) {
      const newValue = value + num.toString();
      onChange(newValue);
      if (newValue.length === maxLength && onComplete) {
        onComplete(newValue);
      }
    }
  };

  const handleBackspace = () => {
    if (value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-6">
      {/* PIN Dots Display */}
      <div className="flex justify-center gap-3">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full border-2 transition-all duration-300",
              i < value.length
                ? "bg-primary border-primary scale-110"
                : "bg-muted border-border",
              error && "border-destructive"
            )}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive text-center font-medium">{error}</p>
      )}

      {/* Number Pad Grid */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            type="button"
            variant="outline"
            size="lg"
            onClick={() => handleNumberClick(num)}
            disabled={value.length >= maxLength}
            className={cn(
              "h-16 text-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-all",
              "border-2 hover:scale-105 active:scale-95"
            )}
          >
            {num}
          </Button>
        ))}
        
        {/* Empty space for layout */}
        <div />
        
        {/* Zero Button */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleNumberClick(0)}
          disabled={value.length >= maxLength}
          className={cn(
            "h-16 text-2xl font-bold hover:bg-primary hover:text-primary-foreground transition-all",
            "border-2 hover:scale-105 active:scale-95"
          )}
        >
          0
        </Button>
        
        {/* Backspace Button */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleBackspace}
          disabled={value.length === 0}
          className={cn(
            "h-16 hover:bg-destructive hover:text-destructive-foreground transition-all",
            "border-2 hover:scale-105 active:scale-95"
          )}
        >
          <Delete className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
