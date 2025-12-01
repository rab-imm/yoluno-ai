import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceVaultManager } from "@/components/dashboard/VoiceVaultManager";
import { VoiceVaultRecorder } from "@/components/dashboard/VoiceVaultRecorder";
import { Mic, Sparkles } from "lucide-react";

export default function VoiceVault() {
  const [recorderOpen, setRecorderOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Voice Vault</h1>
        <p className="text-muted-foreground">
          Record short voice messages to reward and encourage your child
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            How it Works
          </CardTitle>
          <CardDescription>
            Your voice is the most powerful reward for your child
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <p>Record 1-second voice clips with your encouragement, praise, or celebrations</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <p>Organize clips by category: encouragement, praise, or celebration</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <p>When your child completes a mission, they'll hear a surprise message from you!</p>
          </div>
        </CardContent>
      </Card>

      {/* Voice Vault Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Your Voice Clips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VoiceVaultManager onRecordNew={() => setRecorderOpen(true)} />
        </CardContent>
      </Card>

      {/* Recorder Dialog */}
      <VoiceVaultRecorder
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
        onSuccess={() => {}}
      />
    </div>
  );
}
