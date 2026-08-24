export const resumeBuilderSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "A strong, tailored professional summary for the resume, highlighting the student's alignment with the target job (if provided)."
    },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "The section title (e.g., 'Experience & Projects', 'Skills', 'Education')." },
          content: { type: "string", description: "The content of the section, formatted professionally using markdown bullet points or text." },
          order: { type: "number", description: "The integer order of this section (1, 2, 3)." }
        },
        required: ["title", "content", "order"]
      },
      description: "An array of tailored resume sections. The content must emphasize skills relevant to the target job description."
    }
  },
  required: ["summary", "sections"]
};
