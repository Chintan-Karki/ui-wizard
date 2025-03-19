import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateUI } from "./openai";
import { insertMessageSchema } from "@shared/schema";

/**
 * Parses a string containing JSON wrapped in LaTeX \boxed{} with or without markdown code blocks
 * @param inputString The string with LaTeX boxed JSON format
 * @returns Parsed JavaScript object
 */
function parseLatexBoxedJson(inputString: string): any {
  try {
    // Step 1: Extract content between \boxed{ and the last }
    let contents = null;
    
    if (inputString.startsWith("\\boxed{") && inputString.endsWith("}")){
      const boxedMatch = inputString.match(/\\boxed\{([\s\S]*)\}/);
      if (!boxedMatch) throw new Error("Invalid LaTeX boxed JSON format");
      contents = boxedMatch[1].trim();
    }else{
      contents = inputString.trim();
    }
    
    // Step 2: Check if content is wrapped in markdown code block
    const jsonMatch = contents.match(/```json\s*([\s\S]*?)\s*```/);
    
    let jsonContent;
    if (jsonMatch) {
      // Case 1: JSON is inside markdown code block
      jsonContent = jsonMatch[1].trim();
    } else {
      // Case 2: JSON is directly inside the boxed content
      jsonContent = contents;
    }
    
    // Step 3: Parse the JSON
    const result = JSON.parse(jsonContent);
    
    return result;
  } catch (error: unknown) {
    console.error("Error parsing LaTeX boxed JSON:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse the input string: ${errorMessage}`);
  }
}
export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      
      const message = await storage.addMessage(messageData);

      if (message.role === "user") {
        try {
          const uiResponse = await generateUI(message.content);

          // Extract JSON content using regex
          const parsedJSON = parseLatexBoxedJson(uiResponse);
          const htmlMessage = await storage.addMessage({
            content: JSON.stringify(parsedJSON || uiResponse), // Pretty print JSON
            role: "assistant",
            timestamp: Date.now(),
            generatedHtml: uiResponse.html
          });
          res.json([message, htmlMessage]);
        } catch (error) {
          res.status(500).json({ message: "Failed to generate UI" });
        }
      } else {
        res.json([message]);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.delete("/api/messages", async (_req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true, message: "Chat history cleared" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to clear chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
