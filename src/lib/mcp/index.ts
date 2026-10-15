import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listConditions from "./tools/list-conditions";
import getDietPlan from "./tools/get-diet-plan";
import listPackages from "./tools/list-packages";
import listMyOrders from "./tools/list-my-orders";
import listMyQuestions from "./tools/list-my-questions";
import askExpert from "./tools/ask-expert";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "dietary-solutions-hub",
  title: "Dietary Solutions Hub",
  version: "0.1.0",
  instructions:
    "AaharCare tools: browse condition-specific 30-day diet plans with exact quantities (list_conditions, get_diet_plan), see package pricing (list_packages), and, for the signed-in customer, view orders (list_my_orders), view expert Q&A (list_my_questions) and ask a dietitian (ask_expert).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listConditions, getDietPlan, listPackages, listMyOrders, listMyQuestions, askExpert],
});
