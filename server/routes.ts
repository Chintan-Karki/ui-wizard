import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateUI } from "./openai";
import { insertMessageSchema } from "@shared/schema";

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
          const htmlMessage = await storage.addMessage({
            content: JSON.stringify(uiResponse),
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

  const httpServer = createServer(app);
  return httpServer;
}
