import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PreviewPaneProps {
  html: string | null;
}

export default function PreviewPane({ html }: PreviewPaneProps) {
  const [activeTab, setActiveTab] = useState("preview");

  if (!html) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Select a generated UI to preview it here
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[600px]">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="h-full">
        <div className="border rounded-lg h-full overflow-auto">
          <iframe
            srcDoc={html}
            className="w-full h-full"
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      </TabsContent>

      <TabsContent value="code" className="h-full">
        <pre className="h-full overflow-auto bg-muted p-4 rounded-lg">
          <code>{html}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
