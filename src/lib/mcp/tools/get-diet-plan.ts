import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getCondition } from "@/data/plans";

export default defineTool({
  name: "get_diet_plan",
  title: "Get a 30-day diet plan",
  description:
    "Return the full 30-day diet plan for one condition: daily meals with timings and exact quantities, weekly progression, foods to avoid, and the priced monthly grocery list.",
  inputSchema: {
    slug: z
      .string()
      .describe("Condition slug from list_conditions, e.g. 'type-2-diabetes'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const condition = getCondition(slug.trim());
    if (!condition) {
      throw new ToolError(`No diet plan found for slug '${slug}'. Call list_conditions first.`);
    }
    const plan = {
      slug: condition.slug,
      name: condition.name,
      summary: condition.summary,
      calories: condition.calories,
      macros: condition.macros,
      meals: condition.meals,
      weeks: condition.weeks,
      avoid: condition.avoid,
      grocery: condition.grocery,
      monthly_ration_price_inr: condition.monthlyPrice,
      expert_note: condition.expertNote,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
      structuredContent: { plan },
    };
  },
});
