import { defineTool } from "@lovable.dev/mcp-js";
import { packages } from "@/data/plans";

export default defineTool({
  name: "list_packages",
  title: "List purchasable packages",
  description:
    "List AaharCare's monthly packages (plan only, plan plus ration box, full clinical care) with their price in INR and what each one includes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = packages.map((p) => ({ ...p, price_inr: p.price }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { packages: rows },
    };
  },
});
