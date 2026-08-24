export const relevanceRankingSchema = {
  type: "object",
  properties: {
    rankings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          opportunityId: {
            type: "string",
            description: "The unique ID of the opportunity being ranked."
          },
          relevanceScore: {
            type: "number",
            description: "A score from 0.0 to 1.0 indicating how perfectly this matches the student's profile."
          },
          reason: {
            type: "string",
            description: "A short, one-line explanation of why this was recommended to the student."
          }
        },
        required: ["opportunityId", "relevanceScore", "reason"]
      }
    }
  },
  required: ["rankings"]
};
