/**
 * Create Child Dialog
 *
 * Dialog for creating a new child profile.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormDialog } from '@/components/shared/dialogs/FormDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createChildSchema, type CreateChildData } from '@/types/forms';
import { useCreateChildProfile } from '@/hooks/queries';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChildDialog({ open, onOpenChange }: CreateChildDialogProps) {
  const { user } = useAuth();
  const createChild = useCreateChildProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChildData>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      name: '',
      age: 7,
    },
  });

  const onSubmit = async (data: CreateChildData) => {
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
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
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
  );
}
