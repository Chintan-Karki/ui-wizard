import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreviewModal from "./preview-modal";
import { Highlight, themes } from "prism-react-renderer";

interface PreviewPaneProps {
  html: string | null;
  css: string | null;
  javascript: string | null;
  onClose: () => void;
}

const renderCode = (code: string | null, language: string) => {
  if (!code) return null;
  return (
    <Highlight theme={themes.github} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className="h-full overflow-auto bg-muted p-4 rounded-lg" style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })} className="table-row">
              <span className="table-cell text-right pr-4 text-gray-500 select-none w-[3rem]">
                {i + 1}
              </span>
              <span className="table-cell">
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

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
    <div className=" relative">
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          {css && <TabsTrigger value="css">CSS</TabsTrigger>}
          {javascript && <TabsTrigger value="js">JavaScript</TabsTrigger>}
        </TabsList>

        <TabsContent value="preview" className="h-full h-[600px] min-h-75vh]">
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
          {renderCode(html, 'html')}
        </TabsContent>

        {css && (
          <TabsContent value="css" className="h-full">
            {renderCode(css, 'css')}
          </TabsContent>
        )}

        {javascript && (
          <TabsContent value="js" className="h-full">
            {renderCode(javascript, 'javascript')}
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
