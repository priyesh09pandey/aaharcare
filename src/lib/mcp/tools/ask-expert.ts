import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "ask_expert",
  title: "Ask a dietitian",
  description:
    "Send a new question to AaharCare's dietitian panel on behalf of the signed-in customer. Replies appear in their account within 24 hours.",
  inputSchema: {
    question: z.string().trim().min(10).max(2000).describe("The health or diet question."),
    condition_slug: z
      .string()
      .optional()
      .describe("Optional condition slug from list_conditions."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ question, condition_slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("questions")
      .insert({ user_id: ctx.getUserId(), body: question, condition_slug: condition_slug ?? null })
      .select("id, created_at")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Question sent (id ${data.id}). A dietitian will reply within 24 hours.` }],
      structuredContent: { question: data },
    };
  },
});
