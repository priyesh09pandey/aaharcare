import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { conditions } from "@/data/plans";
import {
  authenticateUser,
  registerUser,
} from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in / Register — AaharCare Account" },
      {
        name: "description",
        content:
          "Sign in or register your AaharCare account to order 30-day medical diet plans, track ration deliveries, and consult clinical dietitians.",
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

  // Sign In state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up state
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [conditionSlug, setConditionSlug] = useState(conditions[0]!.slug);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      goNext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setBusy(true);
    const { user, error } = await authenticateUser(email, password);
    setBusy(false);
    if (error || !user) {
      toast.error(error || "Sign in failed. Please check your credentials.");
      return;
    }
    toast.success("Welcome back!", {
      description: `Signed in as ${user.user_metadata?.full_name || user.email}`,
    });
    goNext();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Please provide your full name.");
      return;
    }

    setBusy(true);
    const { user, error } = await registerUser({
      email: signupEmail,
      password: signupPassword,
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
      conditionSlug: conditionSlug,
    });
    setBusy(false);

    if (error || !user) {
      toast.error(error || "Registration failed. Please try again.");
      return;
    }

    toast.success("Account created successfully!", {
      description: `Welcome to AaharCare, ${fullName.trim()}! You can now order diet packages.`,
    });
    goNext();
  };

  const handleDemoSignIn = async () => {
    setBusy(true);
    const { user } = await authenticateUser("demo@aaharcare.com", "password123");
    setBusy(false);
    if (user) {
      toast.success("Signed in with Demo Account!", {
        description: "Exploring as Rahul Sharma (Type 2 Diabetes)",
      });
      goNext();
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: next ? `${window.location.origin}${next}` : window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again or use email.");
      return;
    }
    if (result.redirected) return;
    goNext();
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <Link to="/" className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lift">
        <Leaf className="size-6" />
      </Link>
      <h1 className="mt-4 text-center text-3xl font-display">AaharCare Portal</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Order condition-specific diet packages, track grocery delivery, and consult specialists.
      </p>

      {/* Demo Quick Login for Evaluators */}
      <div className="mt-6 rounded-xl border border-primary/20 bg-primary-soft/40 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-xs font-semibold text-primary">SIH / Demo Mode</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="h-8 text-xs font-medium"
            disabled={busy}
            onClick={handleDemoSignIn}
          >
            1-Click Demo Login
          </Button>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Instantly signs in with sample diet orders, health profile, and dietitian answers.
        </p>
      </div>

      <Card className="mt-6 shadow-lift">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Sign in or create account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full text-sm font-medium"
            disabled={busy}
            onClick={handleGoogle}
          >
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Register</TabsTrigger>
            </TabsList>

            {/* SIGN IN TAB */}
            <TabsContent value="signin" className="pt-3">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="in-email" className="text-xs font-semibold">Email address</Label>
                  <Input
                    id="in-email"
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="in-pass" className="text-xs font-semibold">Password</Label>
                  </div>
                  <Input
                    id="in-pass"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" className="w-full font-medium" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Sign In to Account
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER / SIGN UP TAB */}
            <TabsContent value="signup" className="pt-3">
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <Label htmlFor="up-name" className="text-xs font-semibold">Full name *</Label>
                  <Input
                    id="up-name"
                    required
                    placeholder="e.g. Priyesh Pandey"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="up-email" className="text-xs font-semibold">Email address *</Label>
                  <Input
                    id="up-email"
                    type="email"
                    required
                    placeholder="e.g. priyesh@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="up-pass" className="text-xs font-semibold">Password (min 6 chars) *</Label>
                  <Input
                    id="up-pass"
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="up-phone" className="text-xs font-semibold">Phone number</Label>
                    <Input
                      id="up-phone"
                      placeholder="+91 98765..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="up-city" className="text-xs font-semibold">Delivery City</Label>
                    <Input
                      id="up-city"
                      placeholder="e.g. Delhi, Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1.5 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Primary Health Condition</Label>
                  <Select value={conditionSlug} onValueChange={setConditionSlug}>
                    <SelectTrigger className="mt-1.5 text-xs">
                      <SelectValue placeholder="Select disease condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.slug} value={c.slug} className="text-xs">
                          {c.name} ({c.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full mt-2 font-medium" disabled={busy}>
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle2 className="mr-2 size-4" />}
                  Register & Continue
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Looking for disease meal charts first?{" "}
            <Link to="/plans" className="font-medium text-primary hover:underline">
              Browse all 8 plans
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
