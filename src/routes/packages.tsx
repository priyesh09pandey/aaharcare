import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { packages, conditions } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";


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
  const [selected, setSelected] = useState(packages[1]!.id);
  const [condition, setCondition] = useState(conditions[0]!.slug);

  const [people, setPeople] = useState("1");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");

  const pkg = packages.find((p) => p.id === selected)!;
  const cond = conditions.find((c) => c.slug === condition)!;
  const heads = Math.max(1, Math.min(6, Number(people) || 1));
  const rationExtra = pkg.id === "plan-only" ? 0 : (heads - 1) * Math.round(cond.monthlyPrice * 0.9);
  const total = pkg.price + rationExtra;

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    if (!isAuthenticated || !user) {
      void navigate({ to: "/auth" });
      return;
    }
    if (!contactName.trim() || contactPhone.trim().length < 8 || !deliveryCity.trim()) {
      toast.error("Please add your name, phone number and delivery city so we can confirm the order.");
      return;
    }
    setPlacing(true);
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      condition_slug: cond.slug,
      package_id: pkg.id,
      package_name: pkg.name,
      people: heads,
      amount_inr: total,
      contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(),
      delivery_city: deliveryCity.trim(),
    });
    setPlacing(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order request received", {
      description: `Saved to your account — our team will call you to confirm the ${pkg.name} for ${cond.name}.`,
    });
    void navigate({ to: "/account" });
  };



  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
      <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
        Buy the plan, or the plan with the whole month's ration.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Staples are billed at published market rates with no markup — you only pay
        for the plan, sourcing and delivery.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {packages.map((p) => (
          <Card
            key={p.id}
            className={`relative flex flex-col ${
              p.id === selected ? "border-primary shadow-lift" : "shadow-soft"
            }`}
          >
            {p.featured && (
              <Badge className="absolute -top-3 left-6">Most popular</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
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
                <span className="block text-sm text-muted-foreground">per {p.period}</span>
              </p>
            </CardHeader>
            <CardContent className="mt-auto">
              <ul className="space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={p.id === selected ? "default" : "outline"}
                onClick={() => setSelected(p.id)}
              >
                {p.id === selected ? "Selected" : "Choose this"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl">Build your order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
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
              <div>
                <Label htmlFor="people">People eating this plan</Label>
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
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="mt-1.5"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91"
                  className="mt-1.5"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="city">Delivery city & pincode</Label>
                <Input
                  id="city"
                  placeholder="City, 000000"
                  className="mt-1.5"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                />
              </div>
            </div>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
              Ration boxes ship within 48 hours across 180+ pincodes. Fresh produce
              is delivered twice a month on your chosen day.
            </p>
          </CardContent>
        </Card>

        <Card className="h-fit shadow-lift">
          <CardHeader>
            <CardTitle className="text-xl">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Package</span>
              <span className="font-medium">{pkg.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Condition</span>
              <span className="font-medium">{cond.name}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-muted-foreground">Base price</span>
              <span>₹{pkg.price.toLocaleString("en-IN")}</span>
            </div>
            {rationExtra > 0 && (
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">
                  Extra ration ({heads - 1} more {heads - 1 === 1 ? "person" : "people"})
                </span>
                <span>₹{rationExtra.toLocaleString("en-IN")}</span>
              </div>
            )}
            <Separator className="my-3" />
            <div className="flex items-baseline justify-between">
              <span className="font-medium">Payable this month</span>
              <span className="font-display text-2xl font-semibold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <Button className="mt-5 w-full" disabled={placing} onClick={placeOrder}>
              {placing && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isAuthenticated ? "Place order request" : "Sign in to order"}
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              No payment is taken here yet — our team confirms availability and
              your reports first. Want the plan details?{" "}
              <Link
                to="/plans/$slug"
                params={{ slug: cond.slug }}
                className="font-medium text-primary"
              >
                Review {cond.name}
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
