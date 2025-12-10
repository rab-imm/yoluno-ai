/**
 * FormDialog
 *
 * A reusable dialog component for forms with consistent styling and behavior.
 * Reduces boilerplate across the 9+ dialog components in the codebase.
 */

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface FormDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Form content */
  children: ReactNode;
  /** Form submit handler */
  onSubmit: () => void | Promise<void>;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Submit button label */
  submitLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Max width of dialog */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Whether to show footer buttons */
  showFooter?: boolean;
  /** Additional footer content (rendered before buttons) */
  footerContent?: ReactNode;
  /** Disable closing when clicking outside */
  disableOutsideClick?: boolean;
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  maxWidth = 'md',
  showFooter = true,
  footerContent,
  disableOutsideClick = false,
}: FormDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing while submitting
    if (isSubmitting && !newOpen) return;
    onOpenChange(newOpen);
  };

  const handleInteractOutside = (e: Event) => {
    if (disableOutsideClick || isSubmitting) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={widthClasses[maxWidth]}
        onInteractOutside={handleInteractOutside}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4 space-y-4">{children}</div>

          {showFooter && (
            <DialogFooter className="gap-2 sm:gap-0">
              {footerContent}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

FormDialog.displayName = 'FormDialog';
