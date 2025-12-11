/**
 * Form Dialog
 *
 * Reusable dialog component for forms with consistent styling.
 */

import { type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  isLoading = false,
  isDisabled = false,
  size = 'md',
}: FormDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClasses[size]}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button type="submit" onClick={onSubmit} disabled={isLoading || isDisabled}>
              {isLoading ? 'Saving...' : submitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
