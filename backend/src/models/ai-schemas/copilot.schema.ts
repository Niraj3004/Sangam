export const copilotActionPlanSchema = {
  type: "object",
  properties: {
    skillGaps: {
      type: "array",
      items: { type: "string" },
      description: "An array of 2 to 4 technical or soft skills the student is currently missing based on their profile and career goal."
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "A short, actionable title (e.g., 'Learn React Hooks')." },
          description: { type: "string", description: "A clear description of what exactly they need to do." },
          type: { type: "string", enum: ["skill", "project", "networking", "general"] },
          reasoning: { type: "string", description: "Why this action is specifically recommended for their career goal." }
        },
        required: ["title", "description", "type", "reasoning"]
      },
      description: "An array of exactly 3 concrete, personalized action items for the upcoming week."
    }
  },
  required: ["skillGaps", "items"]
};
