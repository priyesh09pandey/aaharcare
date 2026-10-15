import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCondition } from "@/data/plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Check, ShoppingBasket, X } from "lucide-react";

export const Route = createFileRoute("/plans/$slug")({
  loader: ({ params }) => {
    const condition = getCondition(params.slug);
    if (!condition) throw notFound();
    return { condition };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Plan unavailable — AaharCare" }, { name: "robots", content: "noindex" }],
      };
    }
    const { condition } = loaderData;
    const title = `${condition.name} Diet Plan — 30 Days with Exact Quantities`;
    const url = `https://diet-doctor-pro.lovable.app/plans/${condition.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: condition.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: condition.summary.slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${condition.name} 30-Day Diet Plan & Ration Box`,
            description: condition.summary,
            category: "Therapeutic diet plan",
            brand: { "@type": "Brand", name: "AaharCare" },
            url,
            offers: {
              "@type": "Offer",
              price: condition.monthlyPrice,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
      ],
    };
  },
  component: PlanDetail,
  notFoundComponent: PlanNotFound,
});

function PlanNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-3xl">Plan not found</h1>
      <p className="mt-3 text-muted-foreground">
        We don't have a plan at this address yet.
      </p>
      <Button asChild className="mt-6">
        <Link to="/plans">See all plans</Link>
      </Button>
    </div>
  );
}

function PlanDetail() {
  const { condition } = Route.useLoaderData();
  const total = condition.grocery.reduce((s, g) => s + g.price, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link to="/plans" className="text-sm font-medium text-primary">
        ← All conditions
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Badge variant="secondary">{condition.category}</Badge>
          <h1 className="mt-3 text-4xl sm:text-5xl">{condition.name} diet plan</h1>
          <p className="mt-2 text-lg text-accent-foreground/80">{condition.tagline}</p>
          <p className="mt-4 text-muted-foreground">{condition.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-primary-soft px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-primary">Daily energy</p>
              <p className="mt-1 font-display text-lg">{condition.calories}</p>
            </div>
            {condition.macros.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
                <p className="mt-1 font-medium">{m.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="h-fit shadow-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShoppingBasket className="size-5 text-primary" /> Month's ration box
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl">
              ₹{condition.monthlyPrice.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Groceries for 1 person, 30 days, at current market rates.
            </p>
            <Separator className="my-4" />
            <ul className="space-y-2 text-sm">
              {[
                "Pre-weighed staples, seeds and oils",
                "Two fresh produce deliveries",
                "Printed 30-day meal chart",
                "Dietitian review of your reports",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-5 w-full">
              <Link to="/packages">Order this plan</Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/experts">Talk to a dietitian first</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl">One day on this plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the repeating daily template. Quantities are raw weights unless
          stated as cooked.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {condition.meals.map((meal) => (
            <div key={meal.time} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg">{meal.title}</h3>
                <span className="text-sm font-medium text-primary">{meal.time}</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {meal.items.map((item) => (
                  <li key={item.food} className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0 last:pb-0">
                    <span>{item.food}</span>
                    <span className="shrink-0 font-medium text-muted-foreground">{item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl">How the month progresses</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {condition.weeks.map((w) => (
            <div key={w.week} className="rounded-xl bg-secondary/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{w.week}</p>
              <p className="mt-2 font-medium">{w.focus}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {w.swaps.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <X className="size-5 text-destructive" /> Strictly avoid
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {condition.avoid.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-6">
          <h2 className="flex items-center gap-2 text-xl">
            <AlertTriangle className="size-5 text-accent-foreground" /> Expert note
          </h2>
          <p className="mt-4 text-sm">{condition.expertNote}</p>
          <Button asChild variant="secondary" className="mt-5">
            <Link to="/experts">Ask your question</Link>
          </Button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl">Grocery list & market pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Exactly what the month needs, priced at current wholesale market rates. Buy
          it yourself, or let us deliver it pre-weighed.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/70 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Quantity / month</th>
                <th className="px-4 py-3 font-semibold">Market rate</th>
                <th className="px-4 py-3 text-right font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {condition.grocery.map((g) => (
                <tr key={g.item} className="border-t border-border">
                  <td className="px-4 py-3">{g.item}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.qty}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.rate}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{g.price.toLocaleString("en-IN")}</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-primary-soft/60">
                <td className="px-4 py-3 font-semibold" colSpan={3}>
                  Total ration cost for 30 days
                </td>
                <td className="px-4 py-3 text-right font-display text-lg font-semibold">
                  ₹{total.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
