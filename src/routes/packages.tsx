import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { packages, conditions } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Truck,
  Loader2,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  PackageCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  placeUserOrder,
  authenticateUser,
  registerUser,
  fetchUserProfile,
  type OrderItem,
} from "@/lib/auth-store";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Pricing & Diet Packages — AaharCare" },
      {
        name: "description",
        content:
          "Transparent monthly pricing: plan only, plan with a pre-weighed ration box delivered, or full clinical care with weekly dietitian consults.",
      },
      { property: "og:title", content: "Pricing & Diet Packages — AaharCare" },
      {
        property: "og:description",
        content: "Buy your condition's 30-day plan and the month's groceries at market rates.",
      },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [selected, setSelected] = useState(packages[1]!.id);
  const [condition, setCondition] = useState(conditions[0]!.slug);

  const [people, setPeople] = useState("1");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pay on Delivery");

  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderItem | null>(null);

  // Auth Modal state for unauthenticated users
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const pkg = packages.find((p) => p.id === selected) || packages[1]!;
  const cond = conditions.find((c) => c.slug === condition) || conditions[0]!;
  const heads = Math.max(1, Math.min(6, Number(people) || 1));
  const rationExtra = pkg.id === "plan-only" ? 0 : (heads - 1) * Math.round(cond.monthlyPrice * 0.9);
  const total = pkg.price + rationExtra;

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (!contactName && user.user_metadata?.full_name) {
        setContactName(user.user_metadata.full_name);
      }
      if (!contactPhone && user.user_metadata?.phone) {
        setContactPhone(user.user_metadata.phone);
      }
      if (!deliveryCity && user.user_metadata?.city) {
        setDeliveryCity(user.user_metadata.city);
      }
      if (user.user_metadata?.condition_slug) {
        setCondition(user.user_metadata.condition_slug);
      }
      void fetchUserProfile(user.id).then((p) => {
        if (p) {
          if (p.full_name) setContactName(p.full_name);
          if (p.phone) setContactPhone(p.phone);
          if (p.city) setDeliveryCity(p.city);
          if (p.condition_slug) setCondition(p.condition_slug);
        }
      });
    }
  }, [user]);

  // Execute Order Placement
  const executeOrder = async (targetUserId: string, name: string, phone: string, city: string) => {
    setPlacing(true);
    const { order, error } = await placeUserOrder({
      user_id: targetUserId,
      condition_slug: cond.slug,
      package_id: pkg.id,
      package_name: pkg.name,
      people: heads,
      amount_inr: total,
      contact_name: name.trim(),
      contact_phone: phone.trim(),
      delivery_city: city.trim(),
      delivery_address: deliveryAddress.trim() || undefined,
      payment_method: paymentMethod,
    });
    setPlacing(false);

    if (error || !order) {
      toast.error(error || "Could not place order. Please try again.");
      return;
    }

    setConfirmedOrder(order);
    toast.success("Order Placed Successfully!", {
      description: `Order ID: ${order.id} for ${pkg.name} (${cond.name}).`,
    });
  };

  const handlePlaceOrderClick = async () => {
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!contactName.trim() || contactPhone.trim().length < 8 || !deliveryCity.trim()) {
      toast.error("Please provide your name, phone number, and delivery city.");
      return;
    }

    await executeOrder(user.id, contactName, contactPhone, deliveryCity);
  };

  // Quick Sign In from Checkout Modal
  const handleModalSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter email and password.");
      return;
    }
    setAuthBusy(true);
    const { user: signedInUser, error } = await authenticateUser(loginEmail, loginPassword);
    setAuthBusy(false);

    if (error || !signedInUser) {
      toast.error(error || "Sign in failed.");
      return;
    }

    setShowAuthModal(false);
    toast.success("Signed in!");
    const name = contactName || signedInUser.user_metadata?.full_name || signedInUser.email;
    const phoneNum = contactPhone || signedInUser.user_metadata?.phone || "+91 98765 43210";
    const city = deliveryCity || signedInUser.user_metadata?.city || "New Delhi";

    await executeOrder(signedInUser.id, name, phoneNum, city);
  };

  // Quick Register from Checkout Modal
  const handleModalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || regPassword.length < 6) {
      toast.error("Please fill in all required fields (password min 6 chars).");
      return;
    }

    setAuthBusy(true);
    const { user: registeredUser, error } = await registerUser({
      email: regEmail,
      password: regPassword,
      fullName: regName.trim(),
      phone: regPhone.trim() || contactPhone.trim() || undefined,
      city: deliveryCity.trim() || undefined,
      conditionSlug: cond.slug,
    });
    setAuthBusy(false);

    if (error || !registeredUser) {
      toast.error(error || "Registration failed.");
      return;
    }

    setShowAuthModal(false);
    toast.success("Account created!");
    await executeOrder(
      registeredUser.id,
      regName.trim(),
      regPhone.trim() || contactPhone.trim() || "+91 98765 43210",
      deliveryCity.trim() || "New Delhi",
    );
  };

  // 1-Click Demo Checkout for SIH Evaluators
  const handleDemoCheckout = async () => {
    setAuthBusy(true);
    const { user: demoUser } = await authenticateUser("demo@aaharcare.com", "password123");
    setAuthBusy(false);

    if (demoUser) {
      setShowAuthModal(false);
      toast.success("Using Demo Account (Rahul Sharma)");
      await executeOrder(
        demoUser.id,
        contactName || "Rahul Sharma",
        contactPhone || "+91 98765 43210",
        deliveryCity || "New Delhi",
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Pricing & Plans</p>
          <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl font-display">
            Buy the plan, or the plan with the whole month's ration.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Staples are billed at published wholesale market rates with zero markup — you only pay
            for the clinical nutrition plan, sourcing, and delivery.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary-soft/50 px-4 py-2.5 text-sm">
            <UserRound className="size-4 text-primary" />
            <span>Ordering as <strong className="text-foreground">{user.user_metadata?.full_name || user.email}</strong></span>
          </div>
        )}
      </div>

      {/* 3 PACKAGE TIERS */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {packages.map((p) => (
          <Card
            key={p.id}
            className={`relative flex flex-col transition-all cursor-pointer ${
              p.id === selected ? "border-primary shadow-lift ring-2 ring-primary/20" : "shadow-soft hover:border-primary/50"
            }`}
            onClick={() => setSelected(p.id)}
          >
            {p.featured && (
              <Badge className="absolute -top-3 left-6 bg-primary text-primary-foreground">
                Most popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl font-display">{p.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{p.blurb}</p>
              <p className="mt-3">
                <span className="font-display text-4xl font-semibold">
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                {p.original && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ₹{p.original.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="block text-xs uppercase tracking-wider text-muted-foreground mt-1">per {p.period}</span>
              </p>
            </CardHeader>
            <CardContent className="mt-auto">
              <ul className="space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={p.id === selected ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(p.id);
                }}
              >
                {p.id === selected ? "Selected Plan" : "Choose this"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ORDER CONFIGURATION & CHECKOUT */}
      <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl font-display">1. Customize & Delivery Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-semibold">Medical Condition Plan</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name} ({c.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="people" className="text-xs font-semibold">Members Eating this Diet</Label>
                <Input
                  id="people"
                  type="number"
                  min={1}
                  max={6}
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-xs font-semibold">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Patient / Contact Name"
                  className="mt-1.5"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-semibold">Phone / WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="mt-1.5"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="city" className="text-xs font-semibold">Delivery City *</Label>
                <Input
                  id="city"
                  placeholder="e.g. New Delhi, Bengaluru"
                  className="mt-1.5"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="pay" className="text-xs font-semibold">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pay on Delivery">Cash / UPI on Delivery</SelectItem>
                    <SelectItem value="UPI Instant">UPI (Google Pay, PhonePe, Paytm)</SelectItem>
                    <SelectItem value="Card / NetBanking">Credit / Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-xs font-semibold">Complete Street Address (Optional)</Label>
                <Textarea
                  id="address"
                  placeholder="Flat/House No., Street, Landmark, Pincode"
                  className="mt-1.5 text-sm"
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary-soft/30 p-4">
              <p className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <strong>Doorstep Delivery Guarantee:</strong> Weighed grains, pulses, seeds and oils ship
                  within 48 hours. Fresh produce arrives twice monthly on scheduled dates.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ORDER SUMMARY */}
        <Card className="h-fit shadow-lift border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl font-display">2. Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Package</span>
              <span className="font-medium text-foreground">{pkg.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Condition</span>
              <span className="font-medium text-foreground">{cond.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Base monthly price</span>
              <span>₹{pkg.price.toLocaleString("en-IN")}</span>
            </div>
            {rationExtra > 0 && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">
                  Extra ration ({heads - 1} additional {heads - 1 === 1 ? "person" : "people"})
                </span>
                <span className="font-medium">+₹{rationExtra.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Payment mode</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-base">Total Amount</span>
              <span className="font-display text-3xl font-bold text-primary">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <Button
              className="mt-6 w-full text-base font-medium py-6 shadow-soft hover:shadow-lift"
              disabled={placing}
              onClick={handlePlaceOrderClick}
            >
              {placing ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <PackageCheck className="mr-2 size-5" />
                  Confirm & Place Order
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              <span>100% Genuine, Clinical-Grade Diet Delivery</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* QUICK AUTH MODAL FOR GUESTS */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Sign In or Register to Order</DialogTitle>
            <DialogDescription className="text-sm">
              Create an account in 10 seconds to place your order and view your diet plan anytime.
            </DialogDescription>
          </DialogHeader>

          {/* 1-Click Demo Option for Evaluators */}
          <div className="rounded-xl border border-primary/20 bg-primary-soft/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">SIH Evaluator / Quick Demo?</span>
              <Button size="sm" variant="default" className="h-7 text-xs" onClick={handleDemoCheckout} disabled={authBusy}>
                1-Click Demo Order
              </Button>
            </div>
          </div>

          <Tabs defaultValue="signup" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">New Account</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>

            {/* QUICK REGISTER TAB */}
            <TabsContent value="signup" className="pt-3">
              <form onSubmit={handleModalSignUp} className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Full Name *</Label>
                  <Input
                    required
                    placeholder="Your name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Email *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Create Password (min 6 chars) *</Label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Phone / WhatsApp</Label>
                  <Input
                    type="tel"
                    placeholder="+91"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={authBusy}>
                  {authBusy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle2 className="mr-2 size-4" />}
                  Register & Place Order
                </Button>
              </form>
            </TabsContent>

            {/* QUICK SIGN IN TAB */}
            <TabsContent value="signin" className="pt-3">
              <form onSubmit={handleModalSignIn} className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold">Email Address *</Label>
                  <Input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Password *</Label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={authBusy}>
                  {authBusy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Sign In & Place Order
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ORDER CONFIRMATION RECEIPT MODAL */}
      <Dialog open={!!confirmedOrder} onOpenChange={() => setConfirmedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <CheckCircle2 className="size-8" />
            </div>
            <DialogTitle className="text-2xl font-display">Order Confirmed!</DialogTitle>
            <DialogDescription className="text-sm">
              Your 30-day diet package has been registered with our clinical fulfillment team.
            </DialogDescription>
          </DialogHeader>

          {confirmedOrder && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Order Reference</span>
                  <span className="font-mono font-bold text-primary">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Selected Package</span>
                  <span className="font-semibold">{confirmedOrder.package_name}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Medical Condition</span>
                  <span className="font-medium">{cond.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Recipient</span>
                  <span>{confirmedOrder.contact_name} ({confirmedOrder.contact_phone})</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Delivery City</span>
                  <span>{confirmedOrder.delivery_city}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-display text-xl font-bold text-primary">
                    ₹{confirmedOrder.amount_inr.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-primary-soft/50 p-3.5 text-xs space-y-1 text-muted-foreground">
                <p className="font-semibold text-foreground">Next Steps:</p>
                <p>• Our nutritionist will review your condition and contact you via WhatsApp.</p>
                <p>• Pre-weighed ration staples will be dispatched to {confirmedOrder.delivery_city} within 48 hours.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmedOrder(null);
                    void navigate({ to: "/plans/$slug", params: { slug: cond.slug } });
                  }}
                >
                  View 30-Day Plan
                </Button>
                <Button
                  onClick={() => {
                    setConfirmedOrder(null);
                    void navigate({ to: "/account" });
                  }}
                >
                  Go to My Account <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
