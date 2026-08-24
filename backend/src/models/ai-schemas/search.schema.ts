export const nlSearchSchema = {
  type: "object",
  properties: {
    targetEntity: {
      type: "string",
      enum: ["opportunities", "users", "projects"],
      description: "The primary type of entity the user is searching for."
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description: "Any technical skills, languages, or tools mentioned (e.g., ['React', 'TypeScript'])."
    },
    location: {
      type: "string",
      description: "Any physical location mentioned (e.g., 'Nepal', 'Kathmandu'). Null if not mentioned."
    },
    isRemote: {
      type: "boolean",
      description: "True if the user explicitly asked for remote or work-from-home."
    },
    type: {
      type: "string",
      description: "The type of opportunity (e.g., 'internship', 'part-time', 'job'). Null if not mentioned."
    },
    searchText: {
      type: "string",
      description: "A cleaned up string of leftover keywords to be used in a standard MongoDB text search."
    }
  },
  required: ["targetEntity", "skills"]
};
