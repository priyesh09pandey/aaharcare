import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser } from "@/lib/auth-store";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // 1. Try Supabase cloud auth
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) return { user: data.user };
    } catch {
      // Continue to local check
    }

    // 2. Check local authenticated user
    const local = getLocalUser();
    if (local) {
      const activeUser = {
        id: local.id,
        email: local.email,
        user_metadata: local.user_metadata,
        app_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as unknown as User;
      return { user: activeUser };
    }

    throw redirect({
      to: "/auth",
      search: { next: location.href },
    });
  },
  component: () => <Outlet />,
});
