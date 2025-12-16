import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validatePIN } from "@/lib/pinValidation";

export function useChildPINManagement(childId: string) {
  const queryClient = useQueryClient();
  
  const setPIN = useMutation({
    mutationFn: async ({ pin, enabled }: { pin: string; enabled: boolean }) => {
      if (enabled) {
        const validation = validatePIN(pin);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
      }
      
      const { error } = await supabase
        .from('child_profiles')
        .update({
          pin_code: enabled ? pin : null,
          pin_enabled: enabled
        })
        .eq('id', childId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child-profiles'] });
      toast.success('PIN settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update PIN');
    }
  });
  
  return { setPIN };
}
