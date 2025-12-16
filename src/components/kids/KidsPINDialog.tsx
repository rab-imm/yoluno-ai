import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Delete } from "lucide-react";

interface KidsPINDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => Promise<boolean>;
  childName: string;
}

export function KidsPINDialog({ open, onClose, onSubmit, childName }: KidsPINDialogProps) {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        submitPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const submitPin = async (pinToSubmit: string) => {
    setIsSubmitting(true);
    const success = await onSubmit(pinToSubmit);
    
    if (!success) {
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
    
    setIsSubmitting(false);
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-b from-child-primary/10 to-background border-child-primary/20">
        <div className="text-center space-y-6 py-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-child-primary/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-child-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Enter PIN for {childName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Ask your parent if you don't know your PIN
            </p>
          </div>

          {/* PIN Display */}
          <motion.div
            className="flex justify-center gap-4 py-4"
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all ${
                  pin.length > i
                    ? "bg-child-primary border-child-primary scale-110"
                    : "bg-background border-border"
                }`}
              >
                {pin.length > i && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-white"
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {numbers.map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={isSubmitting}
                className="h-16 text-2xl font-bold bg-card hover:bg-child-primary hover:text-white transition-all hover:scale-110"
                variant="outline"
              >
                {num}
              </Button>
            ))}
          </div>

          {/* Delete Button */}
          <Button
            onClick={handleDelete}
            disabled={pin.length === 0 || isSubmitting}
            variant="ghost"
            className="w-full h-12 text-lg"
          >
            <Delete className="w-5 h-5 mr-2" />
            Delete
          </Button>

          {/* Cancel Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
