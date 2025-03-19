import { messages, type Message, type InsertMessage } from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  clearMessages(): Promise<void>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => a.timestamp - b.timestamp);
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = {
      ...insertMessage,
      id,
      generatedHtml: insertMessage.generatedHtml ?? null // Ensure null for undefined values
    };
    this.messages.set(id, message);
    return message;
  }

  async clearMessages(): Promise<void> {
    try {
      // Clear all messages from storage
      this.messages = new Map();
      return;
    } catch (error) {
      console.error("Failed to clear messages:", error);
      throw new Error("Failed to clear messages");
    }
  }
}

export const storage = new MemStorage();