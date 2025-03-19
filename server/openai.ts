import 'dotenv/config';
import { storage } from './storage';

const LLM_URL = process.env.VITE_LLM_URL; // OPENAI ENDPOINT
const token = process.env.VITE_OPENAI_API_KEY; // OPENAI API KEY
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

Send the response as a stringified JSON object.
REMEMBER: In the response, do not include any additional text or comments, not even whitespace. Also, Do not wrap response with "\\boxed{}." as well.
Example response format must be in stringified JSON format, exactly like:
{
  "html": "<div class='container'>...</div>",
  "css": ".container { ... }",
  "javascript": "document.querySelector('.container')..."
}

`;

export async function generateUI(prompt: string) {
  if (!LLM_URL) {
    throw new Error("LLM_URL is not defined");
  }
  
  // Get previous messages to provide context
  const previousMessages = await storage.getMessages();
  
  // Format messages for the API
  const messageHistory = previousMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Add the current prompt
  const messages = [
    { role: 'system', content: systemPrompt },
    ...messageHistory,
    { role: 'user', content: prompt }
  ];
  console.debug("🚀 🔥 ⚒️ : ~ generatedUI ~ messages:", messages);

  try {
    const response = await fetch(LLM_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'HTTP-Referer': process.env.VITE_SITE_URL || '',
        'X-Title': process.env.VITE_SITE_NAME || 'UI Builder',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.VITE_LLM_MODEL,
        messages: messages,
        response_format: { type: 'json_object' }
      })
    });
    const data = await response.json();
    const content = data.choices[0].message.content || data.choices[0].message[0].content;
    return content;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate UI: ${errorMessage}`);
  }
}
