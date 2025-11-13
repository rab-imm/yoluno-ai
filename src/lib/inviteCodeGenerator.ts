import { supabase } from "@/integrations/supabase/client";

export function generateInviteCode(): string {
  // Generate 8-character alphanumeric code (excluding confusing chars like 0/O, 1/I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createInviteLink(childId: string): Promise<string> {
  const code = generateInviteCode();
  
  // Check if invite already exists for this child
  const { data: existing } = await supabase
    .from('kids_invites')
    .select('invite_code')
    .eq('child_id', childId)
    .eq('is_active', true)
    .maybeSingle();
  
  if (existing) {
    return `${window.location.origin}/play?invite=${existing.invite_code}`;
  }
  
  // Create new invite
  const { data, error } = await supabase
    .from('kids_invites')
    .insert({
      child_id: childId,
      invite_code: code,
      is_active: true,
      expires_at: null,
      max_uses: null
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return `${window.location.origin}/play?invite=${data.invite_code}`;
}
