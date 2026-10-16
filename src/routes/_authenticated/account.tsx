import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Package, Loader2, LogOut, User, Calendar, MapPin, Phone, CheckCircle2, CreditCard } from "lucide-react";
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
import {
  fetchUserProfile,
  updateUserProfile,
  fetchUserOrders,
  fetchUserQuestions,
  askSpecialistQuestion,
  logoutUser,
  type OrderItem,
  type QuestionItem,
} from "@/lib/auth-store";

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
  conditions.find((c) => c.slug === slug)?.name ?? slug ?? "Not specified";

function AccountPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries using unified auth store
  const profileQuery = useQuery({
    queryKey: ["profile", user.id],
    queryFn: () => fetchUserProfile(user.id),
  });

  const ordersQuery = useQuery({
    queryKey: ["orders", user.id],
    queryFn: () => fetchUserOrders(user.id),
  });

  const questionsQuery = useQuery({
    queryKey: ["questions", user.id],
    queryFn: () => fetchUserQuestions(user.id),
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
    if (p) {
      setFullName(p.full_name ?? user.user_metadata?.full_name ?? "");
      setPhone(p.phone ?? user.user_metadata?.phone ?? "");
      setCity(p.city ?? user.user_metadata?.city ?? "");
      if (p.condition_slug) setConditionSlug(p.condition_slug);
    } else if (user.user_metadata) {
      setFullName(user.user_metadata.full_name ?? "");
      setPhone(user.user_metadata.phone ?? "");
      setCity(user.user_metadata.city ?? "");
      if (user.user_metadata.condition_slug) setConditionSlug(user.user_metadata.condition_slug);
    }
  }, [profileQuery.data, user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateUserProfile(user.id, {
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      city: city.trim() || null,
      condition_slug: conditionSlug,
    });
    setSavingProfile(false);
    toast.success("Health profile updated!");
    void queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
  };

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (askText.trim().length < 8) {
      toast.error("Please describe your question in a little more detail.");
      return;
    }
    setAsking(true);
    await askSpecialistQuestion({
      userId: user.id,
      conditionSlug: conditionSlug,
      body: askText.trim(),
    });
    setAsking(false);
    setAskText("");
    toast.success("Question submitted to clinical specialist!", {
      description: "Your reply will appear below within 24 hours.",
    });
    void queryClient.invalidateQueries({ queryKey: ["questions", user.id] });
  };

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logoutUser();
    toast.success("Signed out successfully.");
    void navigate({ to: "/", replace: true });
  };

  const displayName = profileQuery.data?.full_name || user.user_metadata?.full_name || user.email;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      {/* PROFILE HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Patient Portal
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display">{displayName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Primary Focus: <strong className="text-foreground">{conditionName(profileQuery.data?.condition_slug ?? conditionSlug)}</strong></span>
            <span>•</span>
            <span>{user.email}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* LEFT COLUMN: ORDERS & PLANS */}
        <div className="space-y-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl font-display">
                <Package className="size-5 text-primary" /> Purchased Diet Plans & Ration Boxes
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link to="/packages">+ New Order</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersQuery.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <Loader2 className="size-4 animate-spin" /> Loading your orders...
                </div>
              ) : (ordersQuery.data?.length ?? 0) === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    You haven't ordered any diet packages yet.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link to="/packages">Explore 30-Day Packages</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {ordersQuery.data!.map((o: OrderItem) => (
                    <li
                      key={o.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-primary">{o.id}</span>
                          <h3 className="font-semibold text-base mt-0.5">{o.package_name}</h3>
                        </div>
                        <Badge
                          variant={o.status === "confirmed" || o.status === "delivered" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {o.status}
                        </Badge>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t border-border/60 pt-3">
                        <div>
                          <span>Condition: </span>
                          <strong className="text-foreground">{conditionName(o.condition_slug)}</strong>
                        </div>
                        <div>
                          <span>Portion: </span>
                          <strong className="text-foreground">{o.people} {o.people === 1 ? "Person" : "People"}</strong>
                        </div>
                        <div>
                          <span>Amount: </span>
                          <strong className="text-foreground">₹{o.amount_inr.toLocaleString("en-IN")}</strong>
                        </div>
                        <div>
                          <span>Delivery to: </span>
                          <strong className="text-foreground">{o.delivery_city}</strong>
                        </div>
                        <div className="col-span-2 flex items-center justify-between rounded-lg bg-muted/40 px-2.5 py-1.5 mt-1 border border-border/40">
                          <span className="flex items-center gap-1.5">
                            {o.payment_status === "paid" ? (
                              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                            ) : (
                              <CreditCard className="size-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span>Payment: </span>
                            <strong className={o.payment_status === "paid" ? "text-primary font-semibold" : "text-foreground"}>
                              {o.payment_status === "paid" ? "Paid Online" : (o.payment_method || "Pay on Delivery")}
                            </strong>
                          </span>
                          {o.payment_id && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              Ref: {o.payment_id}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                        <Link
                          to="/plans/$slug"
                          params={{ slug: o.condition_slug }}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Open 30-Day Diet Chart & Meal Timings →
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          Ordered on {new Date(o.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* QUESTIONS & EXPERT REPLIES */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-display">
                <MessageCircle className="size-5 text-primary" /> Specialist Consultation & Q&A
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={askQuestion} className="space-y-3">
                <Label htmlFor="ask-body" className="text-xs font-semibold">
                  Ask a follow-up about your diet, medications, or meals:
                </Label>
                <Textarea
                  id="ask-body"
                  placeholder="e.g. Can I take curd with lunch if I have acid reflux?"
                  rows={3}
                  value={askText}
                  onChange={(e) => setAskText(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" size="sm" disabled={asking}>
                  {asking && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Send to Dietitian
                </Button>
              </form>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-3">Your Consultation History</h3>
                {(questionsQuery.data?.length ?? 0) === 0 ? (
                  <p className="text-xs text-muted-foreground">No questions asked yet.</p>
                ) : (
                  <ul className="space-y-3.5">
                    {questionsQuery.data!.map((q: QuestionItem) => (
                      <li key={q.id} className="rounded-xl border border-border p-4 bg-muted/20">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {conditionName(q.condition_slug)}
                        </p>
                        <p className="mt-1 text-sm font-medium">"{q.body}"</p>
                        {q.answer ? (
                          <div className="mt-3 rounded-lg bg-primary-soft/60 p-3 text-xs text-foreground">
                            <p className="font-semibold text-primary">
                              {q.expert || "Clinical Dietitian Reply"}:
                            </p>
                            <p className="mt-1 leading-relaxed">{q.answer}</p>
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground italic">
                            Awaiting response from clinical specialist (within 24h)...
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PROFILE SETTINGS */}
        <div>
          <Card className="shadow-soft sticky top-20">
            <CardHeader>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <User className="size-5 text-primary" /> Health Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div>
                  <Label htmlFor="prof-name" className="text-xs font-semibold">Full name</Label>
                  <Input
                    id="prof-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="prof-email" className="text-xs font-semibold">Email address</Label>
                  <Input
                    id="prof-email"
                    value={user.email}
                    disabled
                    className="mt-1 text-sm bg-muted/40 opacity-70"
                  />
                </div>

                <div>
                  <Label htmlFor="prof-phone" className="text-xs font-semibold">Phone / WhatsApp</Label>
                  <Input
                    id="prof-phone"
                    placeholder="+91"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="prof-city" className="text-xs font-semibold">City</Label>
                  <Input
                    id="prof-city"
                    placeholder="e.g. Mumbai, Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Primary Condition Focus</Label>
                  <Select value={conditionSlug} onValueChange={setConditionSlug}>
                    <SelectTrigger className="mt-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.slug} value={c.slug} className="text-xs">
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={savingProfile}>
                  {savingProfile && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
