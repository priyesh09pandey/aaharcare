import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            <span className="font-display text-base font-semibold">AaharCare</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Condition-specific monthly diet plans with exact quantities, plus the
            ration box to cook them.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Plans</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/plans">All conditions</Link></li>
            <li><Link to="/packages">Pricing</Link></li>
            <li><Link to="/experts">Ask an expert</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>care@aaharcare.in</li>
            <li>+91 90000 12345</li>
            <li>Mon–Sat, 9 AM – 9 PM IST</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Important</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Our plans support, but never replace, medical treatment. Always review
            a therapeutic diet with your treating doctor before starting.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AaharCare Nutrition Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
