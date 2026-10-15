import { createFileRoute, Link } from "@tanstack/react-router";
import { conditions, packages } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroMeal from "@/assets/hero-meal.jpg";
import {
  ArrowRight,
  ClipboardList,
  Scale,
  Stethoscope,
  Truck,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AaharCare — Disease-Specific 30-Day Diet Plans & Ration Delivery" },
      {
        name: "description",
        content:
          "Get a month-long diet plan with exact gram-level quantities for your condition, buy the matching ration box at market rates, and ask specialist dietitians your questions.",
      },
      {
        property: "og:title",
        content: "AaharCare — Disease-Specific 30-Day Diet Plans & Ration Delivery",
      },
      {
        property: "og:description",
        content:
          "Get a month-long diet plan with exact gram-level quantities for your condition, buy the matching ration box at market rates, and ask specialist dietitians your questions.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div>
      <section className="bg-hero-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">
              Built by clinical dietitians
            </Badge>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              A full month of food, measured to the gram, for your exact condition.
            </h1>
            <p className="mt-5 max-w-xl text-base/relaxed opacity-90">
              Diabetes, blood pressure, PCOS, thyroid, fatty liver, kidney disease,
              IBS or weight loss — pick your condition and get a 30-day plan with
              timings, weighed portions and a shopping list. Then let us deliver the
              month's ration, priced at market rate.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/plans">
                  See plans by disease <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/experts">Ask an expert free</Link>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6 text-sm">
              {[
                { k: "8", v: "condition-specific plans" },
                { k: "30", v: "days, fully mapped" },
                { k: "24 h", v: "expert reply time" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-semibold">{s.k}</dt>
                  <dd className="opacity-80">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lift">
            <img
              src={heroMeal}
              alt="Portion-measured therapeutic Indian meal with dal khichdi, vegetables, curd, millet roti and measuring spoons"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl">How it works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Stethoscope,
              title: "1. Tell us your condition",
              text: "Share your diagnosis, medicines and latest lab reports.",
            },
            {
              icon: ClipboardList,
              title: "2. Get the 30-day plan",
              text: "Six meals a day with timings, quantities and weekly progression.",
            },
            {
              icon: Truck,
              title: "3. Order the ration box",
              text: "Pre-weighed staples plus twice-monthly fresh produce, at market rates.",
            },
            {
              icon: Scale,
              title: "4. Review and adjust",
              text: "Experts read your progress and revise portions every week.",
            },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <s.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-lg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-warm-gradient py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl">Plans for every condition</h2>
              <p className="mt-2 text-muted-foreground">
                Each one includes a full daily chart, foods to avoid and a priced grocery list.
              </p>
            </div>
            <Link to="/plans" className="inline-flex items-center gap-1 font-medium text-primary">
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {conditions.map((c) => (
              <Link
                key={c.slug}
                to="/plans/$slug"
                params={{ slug: c.slug }}
                className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lift"
              >
                <Badge variant="secondary">{c.category}</Badge>
                <h3 className="mt-3 text-lg">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                <p className="mt-4 text-sm font-medium text-primary">
                  ₹{c.monthlyPrice.toLocaleString("en-IN")} ration / month
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Exact quantities, not vague advice</h2>
            <p className="mt-3 text-muted-foreground">
              "Eat less rice" is not a plan. Our charts specify raw weights, cooked
              weights, oil in millilitres and salt in grams, so nothing is left to
              guesswork.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Every food listed in grams or millilitres",
                "Six meal slots with clock timings",
                "Household measures next to each weight (katori, spoon)",
                "Weekly swaps so you never eat the same week twice",
                "Vegetarian, eggetarian and non-vegetarian versions",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sample — diabetes lunch
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["Multigrain roti", "2 pieces (60 g flour)"],
                ["Cooked mixed dal", "150 g (30 g raw)"],
                ["Green leafy sabzi", "150 g"],
                ["Cucumber–tomato salad", "100 g"],
                ["Curd", "100 g"],
                ["Cooking oil", "5 ml"],
              ].map(([a, b]) => (
                <li key={a} className="flex justify-between border-b border-border/60 pb-2 last:border-0">
                  <span>{a}</span>
                  <span className="font-medium text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="rounded-2xl bg-hero-gradient px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl">Plans from ₹{packages[0]!.price.toLocaleString("en-IN")} a month</h2>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">
            Take the plan alone, or add the pre-weighed ration box and expert consults.
            Staples are billed at published market rates — no hidden markup.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/packages">See pricing</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/experts">Talk to a dietitian</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
