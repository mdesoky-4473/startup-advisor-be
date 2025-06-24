const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeIdea(idea) {
  const prompt = `
You are a startup advisor. Break down the following startup idea into:

1. Problem Statement
2. Target Audience
3. Value Proposition
4. Suggested Business Model

Startup Idea: "${idea}"
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return { result: response.choices[0].message.content };
}

module.exports = { analyzeIdea };
