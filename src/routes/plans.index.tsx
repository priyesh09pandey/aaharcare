import { createFileRoute, Link } from "@tanstack/react-router";
import { conditions } from "@/data/plans";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/plans/")({
  head: () => ({
    meta: [
      { title: "Condition-Wise Diet Plans — AaharCare" },
      {
        name: "description",
        content:
          "Browse 30-day therapeutic diet plans for diabetes, hypertension, PCOS, thyroid, fatty liver, CKD, IBS and weight loss — every portion in grams.",
      },
      { property: "og:title", content: "Condition-Wise Diet Plans — AaharCare" },
      {
        property: "og:description",
        content: "30-day medical diet plans with exact quantities for every major condition.",
      },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        Diet plans
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
        Pick your condition. Get the full month, gram by gram.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Each plan is built by clinical dietitians around Indian kitchens, with
        daily meal timings, weighed portions, weekly progression and a foods-to-avoid
        list you can stick on the fridge.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {conditions.map((c) => (
          <Card key={c.slug} className="flex flex-col shadow-soft transition-shadow hover:shadow-lift">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{c.category}</Badge>
              <CardTitle className="mt-2 text-xl">{c.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{c.tagline}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <div className="rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Daily energy: </span>
                {c.calories}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  <span className="font-display text-xl font-semibold">
                    ₹{c.monthlyPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-muted-foreground"> ration/month</span>
                </span>
                <Link
                  to="/plans/$slug"
                  params={{ slug: c.slug }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  View plan <ArrowRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-10 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Don't see your condition? Cancer recovery, pregnancy, anaemia, gout,
        post-bariatric and paediatric plans are built to order —{" "}
        <Link to="/experts" className="font-medium text-primary">ask our experts</Link>.
      </p>
    </div>
  );
}
