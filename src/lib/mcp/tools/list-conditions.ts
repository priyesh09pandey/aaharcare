import { defineTool } from "@lovable.dev/mcp-js";
import { conditions } from "@/data/plans";

export default defineTool({
  name: "list_conditions",
  title: "List diet plan conditions",
  description:
    "List every condition AaharCare offers a 30-day therapeutic diet plan for, with its slug, tagline, daily energy target and monthly ration price in INR.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = conditions.map((c) => ({
      slug: c.slug,
      name: c.name,
      category: c.category,
      tagline: c.tagline,
      calories: c.calories,
      monthly_ration_price_inr: c.monthlyPrice,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { conditions: rows },
    };
  },
});
