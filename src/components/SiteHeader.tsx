import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Leaf, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/plans", label: "Diet Plans" },
  { to: "/packages", label: "Pricing" },
  { to: "/experts", label: "Ask an Expert" },
];


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();


  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            AaharCare
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-primary" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
              <Link to="/account">
                <UserRound className="size-4" /> My account
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/packages">Get your plan</Link>
          </Button>

          <button
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={isAuthenticated ? "/account" : "/auth"}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary"
          >
            {isAuthenticated ? "My account" : "Sign in"}
          </Link>
        </nav>

      )}
    </header>
  );
}
