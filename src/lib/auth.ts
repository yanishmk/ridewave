import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUser(redirectTo: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect(`/connexion?redirectTo=${encodeURIComponent(redirectTo)}&error=config`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return { supabase, user };
}
