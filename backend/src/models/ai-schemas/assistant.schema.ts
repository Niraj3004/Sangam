export const profileAssistantSchema = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      items: { type: "string" },
      description: "An array of 2 to 4 concrete, actionable suggestions to improve the user's profile (e.g., 'Add TypeScript to your skills', 'Make your bio more action-oriented')."
    },
    generatedSummary: {
      type: "string",
      description: "A beautifully written, professional 2-3 sentence summary that the user can copy and paste into their CV or LinkedIn 'About' section, based on their skills and goals."
    }
  },
  required: ["suggestions", "generatedSummary"]
};
