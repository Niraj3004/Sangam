export const moderationSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["safe", "spam", "scam", "abuse", "harassment", "impersonation"],
      description: "The primary classification of the text."
    },
    riskLevel: {
      type: "string",
      enum: ["low", "medium", "high", "critical"],
      description: "The severity of the violation. Safe content is low. Pay-to-play internships are high. Abuse is critical."
    },
    reason: {
      type: "string",
      description: "A short, specific reason for the classification."
    }
  },
  required: ["category", "riskLevel", "reason"]
};
