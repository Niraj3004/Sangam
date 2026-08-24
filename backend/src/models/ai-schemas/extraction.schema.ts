// This is the JSON schema we pass to Gemini to enforce structured output.
export const opportunityExtractionSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["project", "internship", "job", "hackathon", "grant"],
      description: "The category of the opportunity."
    },
    title: {
      type: "string",
      description: "A clean, concise title."
    },
    org: {
      type: "string",
      description: "The name of the organization, company, or group offering the opportunity."
    },
    description: {
      type: "string",
      description: "A clear, concise summary of the opportunity."
    },
    field: {
      type: "string",
      description: "The primary industry or field (e.g., Software Engineering, Design, Marketing)."
    },
    deadline: {
      type: "string",
      description: "The application deadline in ISO 8601 format (YYYY-MM-DD). If no deadline is explicitly mentioned, return null or empty string."
    },
    location: {
      type: "string",
      description: "The physical city or country if mentioned, otherwise empty string."
    },
    remote: {
      type: "boolean",
      description: "True if the opportunity is explicitly stated as remote or work-from-home."
    },
    url: {
      type: "string",
      description: "The URL to apply or learn more, if present in the text."
    },
    eligibility: {
      type: "array",
      items: { type: "string" },
      description: "An array of 1-3 short tags describing who is eligible (e.g., 'undergrad', 'Nepal', 'recent grad')."
    },
    confidence: {
      type: "number",
      description: "A float between 0.0 and 1.0 indicating how confident you are that this text represents a real, valid career opportunity. High score (0.9) for clear job posts. Low score (0.3) for spam or vague mentions."
    }
  },
  required: ["type", "title", "org", "description", "field", "remote", "eligibility", "confidence"]
};
