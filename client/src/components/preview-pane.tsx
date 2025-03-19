import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreviewModal from "./preview-modal";

interface PreviewPaneProps {
  html: string | null;
  css: string | null;
  javascript: string | null;
  onClose: () => void;
}

export default function PreviewPane({ html, css, javascript, onClose }: PreviewPaneProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Create a complete HTML document with CSS and JavaScript
  const completeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css || ''}</style>
      </head>
      <body>
        ${html}
        <script>${javascript || ''}</script>
      </body>
    </html>
  `;

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsModalOpen(true)}
          title="Open in fullscreen modal"
        >
          <Maximize2 size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          title="Close preview"
        >
          <X size={18} />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[600px]">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          {css && <TabsTrigger value="css">CSS</TabsTrigger>}
          {javascript && <TabsTrigger value="js">JavaScript</TabsTrigger>}
        </TabsList>

        <TabsContent value="preview" className="h-full">
          <div className="border rounded-lg h-full overflow-auto">
            <iframe
              srcDoc={completeHtml}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              title="Preview"
              referrerPolicy="no-referrer"
              onLoad={(e) => {
                // Add event listener to capture and prevent navigation
                const iframe = e.target as HTMLIFrameElement;
                if (iframe.contentWindow) {
                  iframe.contentWindow.addEventListener('click', (event) => {
                    const target = event.target as HTMLElement;
                    if (target.tagName === 'A' && target.getAttribute('href')) {
                      event.preventDefault();
                      console.log('Navigation prevented');
                    }
                  }, true);
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="html" className="h-full">
          <pre className="h-full overflow-auto bg-muted p-4 rounded-lg">
            <code>{html}</code>
          </pre>
        </TabsContent>

        {css && (
          <TabsContent value="css" className="h-full">
            <pre className="h-full overflow-auto bg-muted p-4 rounded-lg">
              <code>{css}</code>
            </pre>
          </TabsContent>
        )}

        {javascript && (
          <TabsContent value="js" className="h-full">
            <pre className="h-full overflow-auto bg-muted p-4 rounded-lg">
              <code>{javascript}</code>
            </pre>
          </TabsContent>
        )}
      </Tabs>

      <PreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        html={html}
        css={css}
        javascript={javascript}
      />
    </div>
  );
}
