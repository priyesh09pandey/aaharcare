import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { conditions } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Plans, Orders & Expert Replies | AaharCare" },
      {
        name: "description",
        content:
          "Your AaharCare account: purchased diet plans, ration box orders, and follow-up questions answered by your specialist dietitian.",
      },
      { property: "og:title", content: "My Account — AaharCare" },
      {
        property: "og:description",
        content: "Track your diet plans, orders and expert answers.",
      },
    ],
  }),
  component: AccountPage,
});

const conditionName = (slug: string | null) =>
  conditions.find((c) => c.slug === slug)?.name ?? slug ?? "Not set";

function AccountPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, city, condition_slug")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const ordersQuery = useQuery({
    queryKey: ["orders", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const questionsQuery = useQuery({
    queryKey: ["questions", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [conditionSlug, setConditionSlug] = useState(conditions[0]!.slug);
  const [savingProfile, setSavingProfile] = useState(false);

  const [askText, setAskText] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const p = profileQuery.data;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setPhone(p.phone ?? "");
    setCity(p.city ?? "");
    if (p.condition_slug) setConditionSlug(p.condition_slug);
  }, [profileQuery.data]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName || null,
      phone: phone || null,
      city: city || null,
      condition_slug: conditionSlug,
    });
    setSavingProfile(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
    void queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  };

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (askText.trim().length < 10) {
      toast.error("Please describe your question in a little more detail.");
      return;
    }
    setAsking(true);
    const { error } = await supabase.from("questions").insert({
      user_id: user.id,
      condition_slug: conditionSlug,
      body: askText.trim(),
    });
    setAsking(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setAskText("");
    toast.success("Question sent to your specialist", {
      description: "You'll see the written answer here within 24 hours.",
    });
    void queryClient.invalidateQueries({ queryKey: ["questions", user.id] });
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            My account
          </p>
          <h1 className="mt-3 text-4xl">
            {profileQuery.data?.full_name || user.email}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Primary condition: {conditionName(profileQuery.data?.condition_slug ?? null)}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="size-5 text-primary" /> Your plans & orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading your orders…</p>
            ) : (ordersQuery.data?.length ?? 0) === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  You haven't bought a plan yet.
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link to="/packages">Browse packages</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {ordersQuery.data!.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-xl border border-border p-4 shadow-soft"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{o.package_name}</p>
                      <Badge variant={o.status === "paid" ? "default" : "secondary"}>
                        {o.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {conditionName(o.condition_slug)} · {o.people}{" "}
                      {o.people === 1 ? "person" : "people"} · ₹
                      {o.amount_inr.toLocaleString("en-IN")}
                    </p>
                    <Link
                      to="/plans/$slug"
                      params={{ slug: o.condition_slug }}
                      className="mt-2 inline-block text-sm font-medium text-primary"
                    >
                      Open the 30-day plan
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl">Profile details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <Label htmlFor="p-name">Full name</Label>
                <Input
                  id="p-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="p-phone">Phone / WhatsApp</Label>
                <Input
                  id="p-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="p-city">City & pincode</Label>
                <Input
                  id="p-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City, 000000"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Primary condition</Label>
                <Select value={conditionSlug} onValueChange={setConditionSlug}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={savingProfile}>
                {savingProfile && <Loader2 className="mr-2 size-4 animate-spin" />}
                Save profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="size-5 text-primary" /> Follow-up questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={askQuestion} className="space-y-3">
            <Label htmlFor="ask">Ask your specialist</Label>
            <Textarea
              id="ask"
              rows={4}
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder="e.g. My fasting sugar dropped to 95 in week 2 — should I change the evening portion?"
            />
            <Button type="submit" disabled={asking}>
              {asking && <Loader2 className="mr-2 size-4 animate-spin" />}
              Send question
            </Button>
          </form>

          <Separator className="my-6" />

          {questionsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading your thread…</p>
          ) : (questionsQuery.data?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">
              No questions yet. Anything you ask here stays private to your account.
            </p>
          ) : (
            <ul className="space-y-4">
              {questionsQuery.data!.map((q) => (
                <li key={q.id} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-medium">{q.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {conditionName(q.condition_slug)} ·{" "}
                    {new Date(q.created_at).toLocaleDateString("en-IN")}
                  </p>
                  {q.answer ? (
                    <div className="mt-3 rounded-lg bg-primary-soft p-3 text-sm">
                      <p className="font-medium text-primary">Dietitian's answer</p>
                      <p className="mt-1">{q.answer}</p>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="mt-3">
                      Awaiting expert reply
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
