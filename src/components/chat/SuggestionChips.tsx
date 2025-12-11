/**
 * Suggestion Chips Component
 *
 * Quick response suggestions for the chat.
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Suggestion {
  id: string;
  label: string;
  emoji?: string;
}

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  className?: string;
}

export function SuggestionChips({
  suggestions,
  onSelect,
  className,
}: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          className="rounded-full"
        >
          {suggestion.emoji && <span className="mr-1">{suggestion.emoji}</span>}
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
}

export const defaultSuggestions: Suggestion[] = [
  { id: '1', label: 'Tell me a story', emoji: '📖' },
  { id: '2', label: 'Fun facts', emoji: '🧠' },
  { id: '3', label: 'Play a game', emoji: '🎮' },
  { id: '4', label: 'Help with homework', emoji: '📚' },
];
