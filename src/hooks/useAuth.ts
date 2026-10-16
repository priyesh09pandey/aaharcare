import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!active) return;
        setSession(next);
        setLoading(false);
      });

      void supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          setSession(data?.session ?? null);
          setLoading(false);
        })
        .catch((err) => {
          console.warn("Could not retrieve auth session:", err);
          if (active) setLoading(false);
        });

      return () => {
        active = false;
        sub?.subscription?.unsubscribe();
      };
    } catch (err) {
      console.warn("Auth setup caught exception:", err);
      setLoading(false);
    }
  }, []);

  const user: User | null = session?.user ?? null;
  return { session, user, loading, isAuthenticated: !!user };
}
