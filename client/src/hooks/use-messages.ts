import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@shared/schema";

export interface UseMessagesOptions {
  onSelectHtml: (html: string | null) => void;
}

export function useMessages({ onSelectHtml }: UseMessagesOptions) {
  const [input, setInput] = useState("");
  const [failedMessages, setFailedMessages] = useState<{[key: string]: string}>({});
  const [retryingMessages, setRetryingMessages] = useState<{[key: string]: boolean}>({}); 
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const mutation = useMutation<any, any, { content: string, originalInput: string }>({
    mutationFn: async ({ content, originalInput }) => {
      const timestamp = Date.now().toString();
      setFailedMessages(prev => ({ ...prev, [timestamp]: content }));
      try {
        const res = await apiRequest("POST", "/api/messages", {
          content,
          role: "user",
          timestamp: parseInt(timestamp),
          generatedHtml: null 
        });
        setFailedMessages(prev => {
          const { [timestamp]: _, ...rest } = prev;
          return rest;
        });
        return res.json();
      } catch (error) {
        throw { timestamp, error };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: any, variables) => {
      setInput(variables.originalInput);
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Click the retry button to try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput) {
      const originalInput = input;
      setInput("");
      mutation.mutate({ content: trimmedInput, originalInput });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const trimmedInput = input.trim();
      if (trimmedInput) {
        const originalInput = input;
        setInput("");
        mutation.mutate({ content: trimmedInput, originalInput });
      }
    }
  };

  const handleRetry = async (timestamp: string, content: string) => {
    // Prevent multiple retry attempts
    if (retryingMessages[timestamp]) return;
    setRetryingMessages(prev => ({ ...prev, [timestamp]: true }));
    try {
      // Use the mutation directly to handle the retry
      await mutation.mutateAsync({ 
        content, 
        originalInput: content 
      });
      // Remove the old failed message on success
      setFailedMessages(prev => {
        const { [timestamp]: _, ...rest } = prev;
        return rest;
      });
    } finally {
      setRetryingMessages(prev => {
        const { [timestamp]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    failedMessages,
    retryingMessages,
    handleSubmit,
    handleKeyDown,
    handleRetry,
    mutation
  };
}
