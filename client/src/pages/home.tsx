import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/chat-interface";
import PreviewPane from "@/components/preview-pane";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedHtml, setSelectedHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Function to handle preview button click
  const handlePreview = (html: string | null) => {
    setSelectedHtml(html);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          UI Wizard 🎨
        </h1>
        <h5> 
          Describe the UI you want to generate in natural language, and I'll create it for you using HTML, CSS and JS
        </h5>
        <br/>
        
        <div className={cn(
          "grid gap-6",
          showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl mx-auto"
        )}>
          <Card className="p-4">
            <ChatInterface onSelectHtml={handlePreview} />
          </Card>
          
          {showPreview && (
            <Card className="p-4">
              <PreviewPane 
                html={selectedHtml} 
                onClose={() => setShowPreview(false)} 
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
