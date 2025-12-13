/**
 * Kids Stories Page
 *
 * Display child's stories with option to create new ones.
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStoriesByChild } from '@/hooks/queries/useStories';
import { QueryState } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, BookOpen, Sparkles } from 'lucide-react';

export function KidsStoriesPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: stories, isLoading, isError, refetch } = useStoriesByChild(childId);

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
          onRetry={refetch}
          isEmpty={!stories || stories.length === 0}
          emptyTitle="No stories yet!"
          emptyMessage="Create your first magical story"
          emptyIcon={BookOpen}
          emptyAction={
            <Link to={`/story-wizard/${childId}`}>
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Story
              </Button>
            </Link>
          }
        >
          <div className="grid gap-4">
            {stories?.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
        </QueryState>
      </main>
    </div>
  );
}
