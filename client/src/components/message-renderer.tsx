import { Message } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MessageDisplay from "./ui/message-display";

interface MessageRendererProps {
  message: Message;
  onSelectHtml: (html: string | null, css: string | null, javascript: string | null) => void;
}

interface FailedMessageProps {
  content: string;
  timestamp: string;
  onRetry: (timestamp: string, content: string) => void;
  isRetrying: boolean;
}

// Helper function to parse complex JSON string with LaTeX-style formatting
function parseComplexJsonString(str: string) {
  try {
    // First, parse the outer JSON string to get the actual content
    const unescaped = JSON.parse(str);
    
    // Check if it's already a valid JSON object
    if (typeof unescaped === 'object') return unescaped;
    
    // Try to extract the JSON from LaTeX-style boxed format
    const boxedMatch = unescaped.match(/\\boxed{\n([\s\S]*?)}/);
    if (boxedMatch) {
      // Parse the content inside the box
      return JSON.parse(boxedMatch[1]);
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing complex JSON:", error);
    return null;
  }
}

export function MessageRenderer({ message, onSelectHtml }: MessageRendererProps) {
  const isAssistant = message.role === "assistant";
  if (isAssistant && message.content) {
    const generated = JSON.parse(message.content);
    try {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button 
                  variant="outline" 
                  onClick={() => onSelectHtml(
                    generated.html || null, 
                    generated.css || null, 
                    generated.javascript || null
                  )}
                  className="flex-shrink-0"
                >
                  Preview Generated UI
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs text-muted-foreground">
                Click to preview the generated UI in the preview pane
              </TooltipContent>
            </Tooltip>
          </div>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <MessageDisplay message={message} />
          </pre>
        </div>
      );
    } catch (error) {
      console.error("Failed to parse message content:", error);
      return <p>{message.content}</p>;
    }
  }
  return <p>{message.content}</p>;
}

export function FailedMessage({ content, timestamp, onRetry, isRetrying }: FailedMessageProps) {
  return (
    <div className="flex items-start justify-end gap-2 mb-4 last:mb-0 min-w-[150px]">
      <div className="flex flex-col items-start gap-2">
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onRetry(timestamp, content)}
              disabled={isRetrying}
              className="w-[52px] h-[32px] flex items-center justify-center"
            >
              {isRetrying ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Retry"
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs text-muted-foreground">
            Click to try sending again
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="p-4 rounded-lg bg-primary/50 text-primary-foreground w-fit min-w-[60px] max-w-[60%] break-words">
        <p>{content}</p>
      </div>
    </div>
  );
}
