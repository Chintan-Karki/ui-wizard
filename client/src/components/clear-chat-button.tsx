import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ClearChatButtonProps {
  onClear: () => void;
  isClearing?: boolean;
}

const ClearChatButton: React.FC<ClearChatButtonProps> = ({ 
  onClear, 
  isClearing = false 
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onClear}
          disabled={isClearing}
          className="flex items-center gap-2"
        >
          <Trash2 size={16} />
          Clear Chat
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        Clear all chat history
      </TooltipContent>
    </Tooltip>
  );
};

export default ClearChatButton; 