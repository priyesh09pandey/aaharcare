import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser, setLocalUser, type AuthUser } from "@/lib/auth-store";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [localUser, setLocalUserState] = useState<AuthUser | null>(() => getLocalUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // 1. Initial check of local storage user
    const current = getLocalUser();
    if (current && active) {
      setLocalUserState(current);
    }

    // 2. Listen to custom auth events
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<AuthUser | null>;
      if (active) {
        setLocalUserState(custom.detail);
      }
    };
    window.addEventListener("aaharcare_auth_changed", handleAuthChange);

    // 3. Supabase listener with safe try/catch
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
        if (!active) return;
        setSession(next);
        if (next?.user) {
          const authUser: AuthUser = {
            id: next.user.id,
            email: next.user.email ?? "",
            user_metadata: next.user.user_metadata as AuthUser["user_metadata"],
          };
          setLocalUser(authUser);
          setLocalUserState(authUser);
        }
        setLoading(false);
      });

      void supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          setSession(data?.session ?? null);
          if (data?.session?.user) {
            const authUser: AuthUser = {
              id: data.session.user.id,
              email: data.session.user.email ?? "",
              user_metadata: data.session.user.user_metadata as AuthUser["user_metadata"],
            };
            setLocalUser(authUser);
            setLocalUserState(authUser);
          }
          setLoading(false);
        })
        .catch(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
        window.removeEventListener("aaharcare_auth_changed", handleAuthChange);
        sub?.subscription?.unsubscribe();
      };
    } catch {
      if (active) setLoading(false);
      return () => {
        active = false;
        window.removeEventListener("aaharcare_auth_changed", handleAuthChange);
      };
    }
  }, []);

  const activeUser =
    session?.user ??
    (localUser
      ? ({
          id: localUser.id,
          email: localUser.email,
          user_metadata: localUser.user_metadata,
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User)
      : null);

  return {
    session,
    user: activeUser,
    loading,
    isAuthenticated: !!activeUser,
  };
}
