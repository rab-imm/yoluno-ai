import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuardrailSettings } from "@/hooks/dashboard/useGuardrailSettings";
import { Shield, Bell, MessageSquare, Sparkles, Clock, X, Plus, RotateCcw } from "lucide-react";

export function GuardrailSettingsPanel() {
  const { settings, isLoading, isSaving, saveSettings, resetToDefaults } = useGuardrailSettings();
  const [newKeyword, setNewKeyword] = useState("");
  const [newPhrase, setNewPhrase] = useState("");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !settings.custom_blocked_keywords.includes(newKeyword.trim())) {
      saveSettings({ custom_blocked_keywords: [...settings.custom_blocked_keywords, newKeyword.trim()] });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    saveSettings({ custom_blocked_keywords: settings.custom_blocked_keywords.filter(k => k !== keyword) });
  };

  const addPhrase = () => {
    if (newPhrase.trim() && !settings.custom_allowed_phrases.includes(newPhrase.trim())) {
      saveSettings({ custom_allowed_phrases: [...settings.custom_allowed_phrases, newPhrase.trim()] });
      setNewPhrase("");
    }
  };

  const removePhrase = (phrase: string) => {
    saveSettings({ custom_allowed_phrases: settings.custom_allowed_phrases.filter(p => p !== phrase) });
  };

  return (
    <div className="space-y-6">
      {/* Strictness Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Strictness Level
          </CardTitle>
          <CardDescription>
            Control how strictly the AI filters content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.strictness_level}
            onValueChange={(value) => saveSettings({ strictness_level: value })}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="low" id="low" className="mt-1" />
              <div>
                <Label htmlFor="low" className="font-medium cursor-pointer">Low</Label>
                <p className="text-sm text-muted-foreground">Lenient filtering, allows educational exploration</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="medium" id="medium" className="mt-1" />
              <div>
                <Label htmlFor="medium" className="font-medium cursor-pointer">Medium (Default)</Label>
                <p className="text-sm text-muted-foreground">Balanced filtering for everyday use</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="high" id="high" className="mt-1" />
              <div>
                <Label htmlFor="high" className="font-medium cursor-pointer">High</Label>
                <p className="text-sm text-muted-foreground">Strict filtering, only explicitly approved topics</p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Content Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Content Filtering
          </CardTitle>
          <CardDescription>
            Configure how flagged content is handled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Block questionable content</Label>
              <p className="text-sm text-muted-foreground">Immediately block content flagged as yellow</p>
            </div>
            <Switch
              checked={settings.block_on_yellow}
              onCheckedChange={(checked) => saveSettings({ block_on_yellow: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Require explicit approval</Label>
              <p className="text-sm text-muted-foreground">I must approve flagged content before it's shown</p>
            </div>
            <Switch
              checked={settings.require_explicit_approval}
              onCheckedChange={(checked) => saveSettings({ require_explicit_approval: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-expand topics</Label>
              <p className="text-sm text-muted-foreground">Allow AI to explore related topics naturally</p>
            </div>
            <Switch
              checked={settings.auto_expand_topics}
              onCheckedChange={(checked) => saveSettings({ auto_expand_topics: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-destructive" />
            Custom Blocked Keywords
          </CardTitle>
          <CardDescription>
            Add specific words or phrases to always block
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword to block..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            />
            <Button onClick={addKeyword} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.custom_blocked_keywords.map((keyword) => (
              <Badge key={keyword} variant="destructive" className="gap-1">
                {keyword}
                <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:bg-destructive-foreground/20 rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {settings.custom_blocked_keywords.length === 0 && (
              <p className="text-sm text-muted-foreground">No custom blocked keywords</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Allowed Phrases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-500" />
            Custom Allowed Phrases
          </CardTitle>
          <CardDescription>
            Add phrases that should always be allowed (bypass filtering)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter phrase to allow..."
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPhrase()}
            />
            <Button onClick={addPhrase} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.custom_allowed_phrases.map((phrase) => (
              <Badge key={phrase} variant="secondary" className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {phrase}
                <button onClick={() => removePhrase(phrase)} className="ml-1 hover:bg-green-200 dark:hover:bg-green-800 rounded-full">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {settings.custom_allowed_phrases.length === 0 && (
              <p className="text-sm text-muted-foreground">No custom allowed phrases</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure when you receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Alert on yellow flags</Label>
              <p className="text-sm text-muted-foreground">Get notified when content is flagged as questionable</p>
            </div>
            <Switch
              checked={settings.notify_on_yellow}
              onCheckedChange={(checked) => saveSettings({ notify_on_yellow: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Alert on all messages</Label>
              <p className="text-sm text-muted-foreground">Get notified for every approved message</p>
            </div>
            <Switch
              checked={settings.notify_on_green}
              onCheckedChange={(checked) => saveSettings({ notify_on_green: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Behavior
          </CardTitle>
          <CardDescription>
            Customize how the AI responds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Preferred AI Tone</Label>
            <Select
              value={settings.preferred_ai_tone}
              onValueChange={(value) => saveSettings({ preferred_ai_tone: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Max Response Length</Label>
              <span className="text-sm text-muted-foreground">{settings.max_response_length} characters</span>
            </div>
            <Slider
              value={[settings.max_response_length]}
              onValueChange={([value]) => saveSettings({ max_response_length: value })}
              min={100}
              max={500}
              step={50}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Learn from approvals</Label>
              <p className="text-sm text-muted-foreground">Let AI adapt based on your approval decisions</p>
            </div>
            <Switch
              checked={settings.learn_from_approvals}
              onCheckedChange={(checked) => saveSettings({ learn_from_approvals: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Rate Limits
          </CardTitle>
          <CardDescription>
            Control message frequency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Messages per minute</Label>
              <span className="text-sm text-muted-foreground">{settings.messages_per_minute}</span>
            </div>
            <Slider
              value={[settings.messages_per_minute]}
              onValueChange={([value]) => saveSettings({ messages_per_minute: value })}
              min={1}
              max={20}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Messages per hour</Label>
              <span className="text-sm text-muted-foreground">{settings.messages_per_hour}</span>
            </div>
            <Slider
              value={[settings.messages_per_hour]}
              onValueChange={([value]) => saveSettings({ messages_per_hour: value })}
              min={10}
              max={200}
              step={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetToDefaults} disabled={isSaving}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
