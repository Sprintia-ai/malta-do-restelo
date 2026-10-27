import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSession, isSupabaseConfigured, onAuthChange } from "@/lib/supabase";

interface SessionState {
  session: Session | null;
  loading: boolean;
  configured: boolean;
}

/** Current Supabase session, kept in sync with sign-in / sign-out events. */
export function useSupabaseSession(): SessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    getSession().then((s) => {
      if (!active) return;
      setSession(s);
      setLoading(false);
    });

    const unsubscribe = onAuthChange((_event, s) => {
      if (active) setSession(s);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { session, loading, configured: isSupabaseConfigured };
}
