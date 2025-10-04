import { z } from "zod";

export const storyWizardSchema = z.object({
  theme: z.string().min(1, "Please select a theme").max(50),
  characters: z.array(
    z.object({
      name: z.string()
        .trim()
        .min(1, "Character name is required")
        .max(50, "Character name must be less than 50 characters")
        .regex(/^[a-zA-Z0-9\s'-]+$/, "Character name can only contain letters, numbers, spaces, hyphens, and apostrophes"),
      role: z.string().min(1).max(20),
    })
  ).min(1, "At least one character is required").max(5, "Maximum 5 characters allowed"),
  mood: z.string().refine(val => ["funny", "gentle", "moral", "sweet"].includes(val), {
    message: "Please select a valid mood"
  }),
  values: z.array(z.string().min(1)).min(1, "Please select at least one value").max(5, "Maximum 5 values allowed"),
  narrationVoice: z.string().refine(val => ["alloy", "nova", "shimmer"].includes(val), {
    message: "Please select a valid narration voice"
  }),
  illustrationStyle: z.string().refine(val => ["cartoon", "watercolor", "storybook", "minimalist"].includes(val), {
    message: "Please select a valid illustration style"
  }),
  storyLength: z.string().refine(val => ["short", "medium", "long"].includes(val), {
    message: "Please select a valid story length"
  }),
});

export type StoryWizardFormData = z.infer<typeof storyWizardSchema>;

// Sanitize user input to prevent XSS and injection attacks
export function sanitizeStoryInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .slice(0, 500); // Limit length
}

// Validate and sanitize character names
export function validateCharacterName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: "Character name cannot be empty" };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: "Character name must be less than 50 characters" };
  }
  
  if (!/^[a-zA-Z0-9\s'-]+$/.test(trimmed)) {
    return { valid: false, error: "Character name can only contain letters, numbers, spaces, hyphens, and apostrophes" };
  }
  
  return { valid: true };
}
