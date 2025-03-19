import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string | null;
  css: string | null;
  javascript: string | null;
}

export default function PreviewModal({ isOpen, onClose, html, css, javascript }: PreviewModalProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!html) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 flex items-start w-[80vw] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex items-start  justify-center w-full flex-col overflow-auto rounded-lg",
            isFullscreen ? "h-[90vh] max-w-none" : "h-[80vh] max-w-4xl"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b h-[2rem] w-full">
            <h2 className="text-xl font-semibold"></h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </Button>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X size={18} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="h-[calc(100%-4rem)] overflow-hidden w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="px-1 py-2 mb-2 ml-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
                {css && <TabsTrigger value="css">CSS</TabsTrigger>}
                {javascript && <TabsTrigger value="js">JavaScript</TabsTrigger>}
              </TabsList>

              <TabsContent value="preview" className="h-[calc(100%-40px)] w-full">
                <div className="border rounded-lg h-full overflow-auto mx-4">
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

              <TabsContent value="html" className="h-[calc(100%-40px)]">
                <pre className="h-full overflow-auto bg-muted p-4 rounded-lg mx-4">
                  <code>{html}</code>
                </pre>
              </TabsContent>

              {css && (
                <TabsContent value="css" className="h-[calc(100%-40px)]">
                  <pre className="h-full overflow-auto bg-muted p-4 rounded-lg mx-4">
                    <code>{css}</code>
                  </pre>
                </TabsContent>
              )}

              {javascript && (
                <TabsContent value="js" className="h-[calc(100%-40px)]">
                  <pre className="h-full overflow-auto bg-muted p-4 rounded-lg mx-4">
                    <code>{javascript}</code>
                  </pre>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
} 