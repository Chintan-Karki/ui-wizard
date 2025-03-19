import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { MessageRenderer, FailedMessage } from "./message-renderer";
import { MessageInput } from "./message-input";
import { Message } from "@shared/schema";

interface ChatInterfaceProps {
  onSelectHtml: (html: string | null, css: string | null, javascript: string | null) => void;
}

export default function ChatInterface({ onSelectHtml }: ChatInterfaceProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const {
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
  } = useMessages({ onSelectHtml });

  // Scroll to bottom when messages or failed messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, failedMessages]);

  return (
    <div className="flex flex-col min-h-[600px] max-h-[80vh] h-[80vh]">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {messages.map((message: Message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg mb-4 last:mb-0 ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground ml-auto max-w-[60%] w-fit min-w-[60px] break-words"
                  }`}
                >
                  <MessageRenderer message={message} onSelectHtml={onSelectHtml} />
                </div>
              ))}
              {Object.entries(failedMessages).map(([timestamp, content]) => (
                <FailedMessage
                  key={timestamp}
                  timestamp={timestamp}
                  content={content}
                  onRetry={handleRetry}
                  isRetrying={retryingMessages[timestamp]}
                />
              ))}
              {/* Scroll anchor */}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      <MessageInput
        input={input}
        onInputChange={setInput}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
      />
    </div>
  );
}