/**
 * Story Wizard Page
 *
 * Multi-step story creation wizard.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChildProfile } from '@/hooks/queries';
import { LoadingState, ErrorState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

const STEPS = ['Theme', 'Characters', 'Setting', 'Values', 'Preview'];

export function StoryWizardPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: child, isLoading, isError } = useChildProfile(childId);
  const [currentStep, setCurrentStep] = useState(0);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/dashboard/stories');
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleGenerate = () => {
    // TODO: Implement story generation
    navigate('/dashboard/stories');
  };

  if (isLoading) {
    return <LoadingState message="Loading..." fullPage />;
  }

  if (isError || !child) {
    return (
      <ErrorState
        title="Child not found"
        message="The child profile could not be loaded."
        onRetry={() => navigate('/dashboard')}
        retryLabel="Back to Dashboard"
        fullPage
      />
    );
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-story-magic/10 to-background p-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep > 0 ? 'Back' : 'Cancel'}
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>Step {currentStep + 1} of {STEPS.length}</span>
            <span>{STEPS[currentStep]}</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-story-magic" />
              Create a Story for {child.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                {STEPS[currentStep]} selection coming soon...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-end gap-3">
          {isLastStep ? (
            <Button onClick={handleGenerate} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Story
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
