import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { conditions, experts } from "@/data/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";


export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "Ask a Dietitian — Free Expert Q&A | AaharCare" },
      {
        name: "description",
        content:
          "Post your health and diet question and get a written answer from a clinical dietitian within 24 hours, or book a 1:1 video consultation.",
      },
      { property: "og:title", content: "Ask a Dietitian — Free Expert Q&A | AaharCare" },
      {
        property: "og:description",
        content: "Describe your condition and get a specialist dietitian's answer within 24 hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://diet-doctor-pro.lovable.app/experts" },
    ],
    links: [{ rel: "canonical", href: "https://diet-doctor-pro.lovable.app/experts" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seeded
            .filter((q) => q.answer)
            .map((q) => ({
              "@type": "Question",
              name: q.question,
              acceptedAnswer: { "@type": "Answer", text: q.answer },
            })),
        }),
      },
    ],
  }),
  component: ExpertsPage,
});

type Q = { id: number; name: string; condition: string; question: string; answer?: string; expert?: string };

const seeded: Q[] = [
  {
    id: 1,
    name: "Ramesh K.",
    condition: "Type 2 Diabetes",
    question:
      "My fasting sugar is 140 but post-lunch goes to 240. Should I stop rice completely?",
    expert: "Dr. Ananya Rao",
    answer:
      "You don't need to stop rice — you need to cap it. Keep 40 g raw rice (about ¾ katori cooked) per meal, always paired with 150 g vegetables and 30 g protein, and walk 20 minutes after lunch. That combination usually pulls a 240 post-meal reading down by 40–60 mg/dL within two weeks.",
  },
  {
    id: 2,
    name: "Sunita M.",
    condition: "Hypothyroidism",
    question: "Can I drink milk right after my thyroid tablet?",
    expert: "Dr. Sneha Patel",
    answer:
      "No. Calcium blocks thyroxine absorption. Take the tablet with plain water and wait 45–60 minutes before milk, tea, or any calcium or iron supplement.",
  },
  {
    id: 3,
    name: "Aditi S.",
    condition: "PCOS / PCOD",
    question: "I have PCOS and my periods are irregular. Is a keto diet safe for me?",
    expert: "Meera Krishnan",
    answer:
      "Strict keto is rarely needed and hard to sustain. A low glycaemic load plan with 80–90 g protein, 30 g fibre and seed cycling improves insulin sensitivity and cycle regularity with far better long-term adherence.",
  },
];

function ExpertsPage() {
  const [questions, setQuestions] = useState<Q[]>(seeded);
  const [name, setName] = useState("");
  const [cond, setCond] = useState(conditions[0]!.name);
  const [text, setText] = useState("");

  const { user } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || text.trim().length < 10) {
      toast.error("Please add your name and describe your problem in a little more detail.");
      return;
    }
    if (user) {
      const slug = conditions.find((c) => c.name === cond)?.slug ?? conditions[0]!.slug;
      const { error } = await supabase.from("questions").insert({
        user_id: user.id,
        condition_slug: slug,
        body: text.trim(),
      });
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    setQuestions((prev) => [
      { id: Date.now(), name: name.trim(), condition: cond, question: text.trim() },
      ...prev,
    ]);
    setName("");
    setText("");
    toast.success("Question sent to our panel", {
      description: user
        ? "Saved to your account — the specialist's reply will appear there within 24 hours."
        : "Sign in to track the reply inside your account.",
    });
  };


  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
        Ask an expert
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">
        Describe your problem. A specialist answers it.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every question is routed to the dietitian who handles that condition daily.
        Written answers are free; deeper cases can move to a 1:1 video consult.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock, title: "Answer in 24 hours", text: "Written reply from a named specialist." },
          { icon: ShieldCheck, title: "Private by default", text: "Reports and details are never published." },
          { icon: MessageCircle, title: "Follow-ups included", text: "Ask twice more on the same thread." },
        ].map((b) => (
          <div key={b.title} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <b.icon className="size-5 text-primary" />
            <p className="mt-3 font-medium">{b.title}</p>
            <p className="text-sm text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Card className="h-fit shadow-lift">
          <CardHeader>
            <CardTitle className="text-xl">Post your question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="q-name">Your name</Label>
                <Input
                  id="q-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyesh P."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Condition</Label>
                <Select value={cond} onValueChange={setCond}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((c) => (
                      <SelectItem key={c.slug} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other / not sure">Other / not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="q-text">Your problem</Label>
                <Textarea
                  id="q-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder="Include your age, weight, medicines and recent lab values if you have them."
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" className="w-full">
                Send to the expert panel
              </Button>
              <p className="text-xs text-muted-foreground">
                For emergencies (chest pain, very high sugar, breathlessness) contact
                a hospital immediately — this service is not for emergencies.
              </p>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl">Recent questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {questions.map((q) => (
              <AccordionItem key={q.id} value={String(q.id)}>
                <AccordionTrigger className="text-left">
                  <span>
                    <span className="block text-sm text-muted-foreground">
                      {q.name} · {q.condition}
                    </span>
                    {q.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {q.answer ? (
                    <div className="rounded-lg bg-primary-soft/70 p-4 text-sm">
                      <p className="font-medium text-primary">{q.expert} replies</p>
                      <p className="mt-2">{q.answer}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Awaiting reply — a specialist usually answers within 24 hours.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl">Our expert panel</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map((e) => (
            <div key={e.name} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {e.initials}
                </span>
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm">{e.focus}</p>
              <Badge variant="secondary" className="mt-3">{e.experience} experience</Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
