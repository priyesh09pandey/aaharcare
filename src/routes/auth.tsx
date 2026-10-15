import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to your AaharCare account" },
      {
        name: "description",
        content:
          "Sign in or create an AaharCare account to view your purchased diet plans, ration deliveries and expert answers in one place.",
      },
      { property: "og:title", content: "Sign in to your AaharCare account" },
      {
        property: "og:description",
        content: "Access your diet plans, orders and expert follow-ups.",
      },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { next?: string } => {
    const n = s["next"];
    return typeof n === "string" && n.startsWith("/") && !n.startsWith("//") ? { next: n } : {};
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const goNext = () => {
    if (next) window.location.assign(next);
    else void navigate({ to: "/account", replace: true });
  };
  const { isAuthenticated, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      goNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    goNext();
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Please use a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${next ?? "/account"}`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setSent(true);
      toast.success("Check your email to confirm your account.");
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: next ? `${window.location.origin}${next}` : window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    goNext();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="size-6" />
      </span>
      <h1 className="mt-5 text-center text-3xl">Your AaharCare account</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        See your purchased plans, ration deliveries and expert replies in one place.
      </p>

      <Card className="mt-8 shadow-lift">
        <CardHeader>
          <CardTitle className="text-lg">
            {sent ? "Confirm your email" : "Sign in or create an account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground">
              We've emailed a confirmation link to <strong>{email}</strong>. Open it
              and you'll land straight in your account.
            </p>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={busy}
                onClick={google}
              >
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>

              <Tabs defaultValue="signin">
                <TabsList className="w-full">
                  <TabsTrigger value="signin" className="flex-1">Sign in</TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={signIn} className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="in-email">Email</Label>
                      <Input
                        id="in-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="in-pass">Password</Label>
                      <Input
                        id="in-pass"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={signUp} className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="up-name">Full name</Label>
                      <Input
                        id="up-name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="up-email">Email</Label>
                      <Input
                        id="up-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="up-pass">Password</Label>
                      <Input
                        id="up-pass"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                      Create account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Just browsing?{" "}
            <Link to="/plans" className="font-medium text-primary">
              See the diet plans
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
