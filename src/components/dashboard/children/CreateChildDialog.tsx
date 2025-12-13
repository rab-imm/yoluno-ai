/**
 * Create Child Dialog
 *
 * Dialog for creating a new child profile.
 * Supports both controlled and trigger-based patterns.
 */

import { useState, cloneElement, isValidElement, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/shared/dialogs/FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createChildSchema, type CreateChildFormData } from '@/types/forms';
import { useCreateChildProfile } from '@/hooks/queries';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateChildDialogProps {
  // Controlled mode
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Trigger mode
  trigger?: ReactElement;
}

export function CreateChildDialog({ open: controlledOpen, onOpenChange, trigger }: CreateChildDialogProps) {
  const { user } = useAuth();
  const createChild = useCreateChildProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled or internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChildFormData>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      name: '',
      age: 7,
    },
  });

  const onSubmit = async (data: CreateChildFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createChild.mutateAsync({
        user_id: user.id,
        name: data.name,
        age: data.age,
        personality_mode: data.personalityMode,
        interests: data.interests,
      });
      toast.success('Child profile created!');
      reset();
      setOpen(false);
    } catch {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  // Render trigger if provided
  const triggerElement = trigger && isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
          (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
          setOpen(true);
        },
      } as Partial<unknown>)
    : null;

  return (
    <>
      {triggerElement}
      <FormDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Add Child Profile"
        description="Create a profile for your child to personalize their experience."
        submitLabel="Create Profile"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        onCancel={() => reset()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter child's name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={3}
              max={18}
              {...register('age', { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>
        </div>
      </FormDialog>
    </>
  );
}
