import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ProfileRole = 'admin' | 'courier';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
  phone: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateProfileInput = {
  email: string;
  full_name: string;
  role: ProfileRole;
  phone?: string;
};

export async function listProfiles(): Promise<Profile[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list profiles: ${error.message}`);
  }

  return (data ?? []) as Profile[];
}

export async function createProfile(
  input: CreateProfileInput,
): Promise<Profile> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      email: input.email,
      full_name: input.full_name,
      role: input.role,
      phone: input.phone ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return data as Profile;
}

export async function getFirstProfile(): Promise<Profile | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get first profile: ${error.message}`);
  }

  return (data as Profile | null) ?? null;
}
