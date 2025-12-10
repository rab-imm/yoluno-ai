import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PINInputGrid } from "./PINInputGrid";
import { useChildPINManagement } from "@/hooks/dashboard/useChildPINManagement";
import { createInviteLink } from "@/lib/inviteCodeGenerator";
import { Copy, Check, Lock, Link as LinkIcon, QrCode } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/lib/errors";

interface EditChildProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: any;
  onSuccess?: () => void;
}

export function EditChildProfileDialog({ open, onOpenChange, child, onSuccess }: EditChildProfileDialogProps) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age);
  const [personalityMode, setPersonalityMode] = useState(child.personality_mode);
  const [pinEnabled, setPinEnabled] = useState(child.pin_enabled || false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);
  
  const { setPIN } = useChildPINManagement(child.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && child.pin_enabled) {
      loadInviteLink();
    }
  }, [open, child.id]);

  const loadInviteLink = async () => {
    try {
      const link = await createInviteLink(child.id);
      setInviteLink(link);
    } catch (error) {
      handleError(error, {
        strategy: 'log',
        context: 'EditChildProfileDialog.loadInviteLink'
      });
    }
  };

  const handleSaveGeneral = async () => {
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({
          name,
          age,
          personality_mode: personalityMode
        })
        .eq('id', child.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['child-profiles'] });
      toast.success('Profile updated successfully');
      onSuccess?.();
    } catch (error) {
      handleError(error, {
        userMessage: 'Failed to update profile',
        context: 'EditChildProfileDialog.handleSaveGeneral'
      });
    }
  };

  const handlePINToggle = async (checked: boolean) => {
    if (!checked) {
      // Disabling PIN
      setPIN.mutate({ pin: "", enabled: false });
      setPinEnabled(false);
      setPin("");
      setConfirmPin("");
      setPinError("");
      setIsChangingPin(false);
    } else {
      setPinEnabled(true);
      setIsChangingPin(true);
    }
  };

  const handleSavePIN = () => {
    setPinError("");

    if (pin.length !== 4) {
      setPinError("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setPinError("PINs do not match");
      return;
    }

    setPIN.mutate(
      { pin, enabled: true },
      {
        onSuccess: () => {
          setPin("");
          setConfirmPin("");
          setIsChangingPin(false);
          loadInviteLink();
        }
      }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const qrCodeUrl = inviteLink 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Profile: {child.name}</DialogTitle>
          <DialogDescription>Update profile information and manage security settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security & Access</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Child's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  min={3}
                  max={12}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">Personality Mode</Label>
                <Select value={personalityMode} onValueChange={setPersonalityMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curious_explorer">Curious Explorer</SelectItem>
                    <SelectItem value="creative_storyteller">Creative Storyteller</SelectItem>
                    <SelectItem value="logical_thinker">Logical Thinker</SelectItem>
                    <SelectItem value="empathetic_friend">Empathetic Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveGeneral} className="w-full">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Kids Mode PIN Protection
                </CardTitle>
                <CardDescription>
                  Require a 4-digit PIN before your child can access their profile in Kids Mode
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pin-toggle">Enable PIN Protection</Label>
                  <Switch
                    id="pin-toggle"
                    checked={pinEnabled}
                    onCheckedChange={handlePINToggle}
                  />
                </div>

                {pinEnabled && (isChangingPin || !child.pin_code) && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Enter New PIN</Label>
                      <PINInputGrid
                        value={pin}
                        onChange={setPin}
                        error={pinError}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Confirm PIN</Label>
                      <PINInputGrid
                        value={confirmPin}
                        onChange={setConfirmPin}
                      />
                    </div>

                    <Button 
                      onClick={handleSavePIN}
                      disabled={pin.length !== 4 || confirmPin.length !== 4}
                      className="w-full"
                    >
                      Save PIN
                    </Button>
                  </div>
                )}

                {pinEnabled && child.pin_code && !isChangingPin && (
                  <div className="p-4 border rounded-lg bg-success/10 border-success/20">
                    <p className="text-sm font-medium text-success mb-2">✓ PIN is currently enabled</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingPin(true)}
                      className="w-full"
                    >
                      Change PIN
                    </Button>
                  </div>
                )}

                {!pinEnabled && (
                  <div className="p-4 border rounded-lg bg-warning/10 border-warning/20">
                    <p className="text-sm text-warning-foreground">
                      ⚠️ Anyone can access this profile without a PIN in Kids Mode
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {pinEnabled && inviteLink && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Share Kids Mode Access
                  </CardTitle>
                  <CardDescription>
                    Share this link or QR code so your child can easily access their profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={inviteLink}
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopyLink}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border">
                    <QrCode className="h-5 w-5 text-muted-foreground mb-2" />
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for Kids Mode"
                      className="rounded"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Scan this QR code to access Kids Mode
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
