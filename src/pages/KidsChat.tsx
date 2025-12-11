/**
 * Kids Chat Page
 *
 * Child-facing AI chat interface.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChild } from '@/contexts/ChildContext';
import { useChat } from '@/contexts/ChatContext';
import { useChildProfile } from '@/hooks/queries';
import { LoadingState, ErrorState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function KidsChatPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { enterKidsMode, exitKidsMode } = useChild();
  const { startSession, endSession } = useChat();
  const { data: child, isLoading, isError } = useChildProfile(childId);

  useEffect(() => {
    if (child && childId) {
      enterKidsMode(child);
      startSession(childId);
    }

    return () => {
      endSession();
      exitKidsMode();
    };
  }, [child, childId, enterKidsMode, exitKidsMode, startSession, endSession]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return <LoadingState message="Loading..." fullPage />;
  }

  if (isError || !child) {
    return (
      <ErrorState
        title="Child not found"
        message="The child profile could not be loaded."
        onRetry={handleBack}
        retryLabel="Back to Dashboard"
        fullPage
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-child-primary/10 to-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-3">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>
        <h1 className="text-lg font-semibold">Hi, {child.name}!</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </header>

      {/* Chat area - placeholder */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-child-primary/20" />
          <h2 className="text-2xl font-bold">Welcome, {child.name}!</h2>
          <p className="mt-2 text-muted-foreground">
            Chat interface coming soon...
          </p>
        </div>
      </main>
    </div>
  );
}
