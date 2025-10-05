import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  content: string;
  theme: string | null;
  mood: string | null;
  is_favorite: boolean;
  bedtime_ready: boolean;
  duration_seconds: number | null;
  illustrations: any;
  created_at: string;
}

export function useStories(childId: string) {
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["child-stories", childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("child_stories")
        .select("*")
        .eq("child_id", childId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Story[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ storyId, currentValue }: { storyId: string; currentValue: boolean }) => {
      const { error } = await supabase
        .from("child_stories")
        .update({ is_favorite: !currentValue })
        .eq("id", storyId);

      if (error) throw error;
      return { storyId, newValue: !currentValue };
    },
    onMutate: async ({ storyId, currentValue }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["child-stories", childId] });
      const previousStories = queryClient.getQueryData<Story[]>(["child-stories", childId]);

      queryClient.setQueryData<Story[]>(["child-stories", childId], (old) =>
        old?.map((s) => (s.id === storyId ? { ...s, is_favorite: !currentValue } : s))
      );

      return { previousStories };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["child-stories", childId], context?.previousStories);
      toast.error("Failed to update favorite status");
    },
    onSuccess: (data) => {
      toast.success(data.newValue ? "Added to favorites" : "Removed from favorites");
    },
  });

  const deleteStory = useMutation({
    mutationFn: async (storyId: string) => {
      const { error } = await supabase
        .from("child_stories")
        .delete()
        .eq("id", storyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child-stories", childId] });
      toast.success("Story deleted");
    },
    onError: () => {
      toast.error("Failed to delete story");
    },
  });

  return {
    stories,
    isLoading,
    toggleFavorite: toggleFavorite.mutate,
    deleteStory: deleteStory.mutate,
  };
}
