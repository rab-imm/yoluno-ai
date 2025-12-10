import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface CustomContentEditorProps {
  childId: string;
  onContentAdded?: () => void;
}

export const CustomContentEditor = ({ childId, onContentAdded }: CustomContentEditorProps) => {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [ageRange, setAgeRange] = useState<string>("5-7");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim().toLowerCase())) {
      setKeywords([...keywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = async () => {
    if (!topic.trim() || !question.trim() || !answer.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (keywords.length === 0) {
      toast.error("Please add at least one keyword");
      return;
    }

    setSaving(true);
    try {
      const { data: childData } = await supabase
        .from('child_profiles')
        .select('parent_id')
        .eq('id', childId)
        .single();

      if (!childData) {
        throw new Error('Child profile not found');
      }

      const { error } = await supabase
        .from('custom_content')
        .insert({
          parent_id: childData.parent_id,
          topic: topic.trim(),
          question: question.trim(),
          answer: answer.trim(),
          age_range: ageRange,
          child_id: childId,
          keywords: keywords
        });

      if (error) throw error;

      toast.success("Custom content added successfully!");
      
      // Reset form
      setTopic("");
      setQuestion("");
      setAnswer("");
      setKeywords([]);
      setKeywordInput("");
      
      if (onContentAdded) {
        onContentAdded();
      }
    } catch (error) {
      console.error('Error saving custom content:', error);
      toast.error('Failed to save custom content');
    } finally {
      setSaving(false);
    }
  };

  const suggestedTopics = [
    "Space", "Animals", "Science", "Math", "Nature", 
    "History", "Art", "Music", "Sports", "Food"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Q&A</CardTitle>
        <CardDescription>
          Add your own questions and answers for personalized learning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic *</Label>
          <div className="flex gap-2">
            <Input
              id="topic"
              placeholder="e.g., Space, Animals, Science"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                {suggestedTopics.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question">Question *</Label>
          <Input
            id="question"
            placeholder="What question might your child ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Answer *</Label>
          <Textarea
            id="answer"
            placeholder="Write a clear, age-appropriate answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {answer.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age-range">Age Range *</Label>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger id="age-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5-7">Ages 5-7 (Simple explanations)</SelectItem>
              <SelectItem value="8-10">Ages 8-10 (More detailed)</SelectItem>
              <SelectItem value="11-12">Ages 11-12 (Advanced concepts)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords *</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              placeholder="Add keywords to help match questions"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddKeyword}
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Press Enter or click + to add keywords
          </p>
        </div>

        <div className="pt-4 flex gap-2">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex-1"
          >
            {saving ? "Saving..." : "Save Custom Content"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setTopic("");
              setQuestion("");
              setAnswer("");
              setKeywords([]);
              setKeywordInput("");
            }}
          >
            Clear
          </Button>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h4 className="text-sm font-semibold">💡 Tips for Great Content:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use simple, clear language appropriate for the age range</li>
            <li>• Include relatable examples and analogies</li>
            <li>• Add multiple keywords to improve matching</li>
            <li>• Keep answers engaging and positive</li>
            <li>• Use emojis to make it fun! 🌟</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
