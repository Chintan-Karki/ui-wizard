import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default-key"
});

const systemPrompt = `You are an expert UI developer that converts natural language descriptions into clean, semantic HTML/CSS/JS. Output only valid, well-structured code that follows best practices. Return responses in JSON format with html, css (optional), and javascript (optional) fields.

For HTML:
- Use semantic HTML5 elements
- Ensure accessibility with ARIA attributes where needed
- Keep markup clean and minimal

For CSS:
- Use modern CSS features
- Focus on responsive design
- Follow BEM naming convention

For JavaScript:
- Use vanilla JS, no frameworks
- Focus on functionality
- Keep code clean and minimal

Example response format:
{
  "html": "<div class='container'>...</div>",
  "css": ".container { ... }",
  "javascript": "document.querySelector('.container')..."
}`;

export async function generateUI(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    throw new Error(`Failed to generate UI: ${error.message}`);
  }
}
