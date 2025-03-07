import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

export function MessageInput({ 
  input, 
  onInputChange, 
  onKeyDown, 
  onSubmit, 
  isPending 
}: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Describe the UI you want to generate..."
        className="flex-1 min-h-[100px] max-h-[100px] py-2"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="submit" disabled={isPending} className="h-[40px] px-3">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Send message (Cmd/Ctrl + Enter)</p>
        </TooltipContent>
      </Tooltip>
    </form>
  );
}
