/**
 * Kids Stories Page
 *
 * Display child's stories with option to create new ones.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoriesByChild } from '@/hooks/queries/useStories';
import { QueryState } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, Plus, BookOpen, X } from 'lucide-react';
import type { StoryWithDetails } from '@/services/stories';

export function KidsStoriesPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: stories, isLoading, isError, refetch } = useStoriesByChild(childId);
  const [selectedStory, setSelectedStory] = useState<StoryWithDetails | null>(null);

  const handleBack = () => {
    navigate(`/kids/${childId}`);
  };

  return (
    <div className="min-h-screen bg-kids-gradient safe-area-inset">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <h1 className="text-xl font-display font-bold">My Stories</h1>

        <Link to={`/story-wizard/${childId}`}>
          <Button
            size="icon"
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="px-4 pb-8">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          data={stories}
          onRetry={refetch}
          emptyTitle="No stories yet!"
          emptyDescription="Create your first magical story"
          emptyIcon={BookOpen}
          emptyAction={{
            label: 'Create Story',
            onClick: () => navigate(`/story-wizard/${childId}`),
          }}
        >
          {(storyList) => (
            <div className="grid gap-4">
              {storyList.map((story) => (
                <Card
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-pink-100 p-3">
                        <BookOpen className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-foreground truncate">
                          {story.title}
                        </h3>
                        {story.theme && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {story.theme}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(story.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {story.is_favorite && (
                        <span className="text-xl">⭐</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </QueryState>
      </main>

      {/* Story Reader Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col bg-gradient-to-b from-pink-50 to-purple-50">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-display pr-8">
              {selectedStory?.title}
            </DialogTitle>
            {selectedStory?.theme && (
              <p className="text-sm text-muted-foreground">
                Theme: {selectedStory.theme}
              </p>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {/* Illustration */}
            {(selectedStory as { illustration_url?: string })?.illustration_url && (
              <div className="rounded-xl overflow-hidden border-2 border-pink-200">
                <img
                  src={(selectedStory as { illustration_url?: string }).illustration_url!}
                  alt={`Illustration for ${selectedStory?.title}`}
                  className="w-full h-auto max-h-[200px] object-cover"
                />
              </div>
            )}

            {/* Story Content */}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {selectedStory?.content}
              </p>
            </div>
          </div>

          {selectedStory?.mood && (
            <div className="flex-shrink-0 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Mood:</span>
                <span className="capitalize">{selectedStory.mood}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
