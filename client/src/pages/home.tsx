import { Card } from "@/components/ui/card";
import ChatInterface from "@/components/chat-interface";
import PreviewPane from "@/components/preview-pane";
import { useState } from "react";

export default function Home() {
  const [selectedHtml, setSelectedHtml] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          UI Generator Chat
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <ChatInterface onSelectHtml={setSelectedHtml} />
          </Card>
          
          <Card className="p-4">
            <PreviewPane html={selectedHtml} />
          </Card>
        </div>
      </div>
    </div>
  );
}
