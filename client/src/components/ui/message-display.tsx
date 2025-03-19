import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Highlight, themes } from "prism-react-renderer";

// Define the Message interface
interface Message {
  content: string;
  role: string;
  timestamp?: number;
  generatedHtml?: string | null;
  id?: number;
}

interface MessageDisplayProps {
  message: Message;
}

interface CodeContent {
  html: string;
  css: string;
  javascript: string;
}

/**
 * Parses a specially formatted string containing code components in a "boxed" format
 * @param inputString The specially formatted string to parse
 * @returns An object with html, css, and javascript properties
 */
function parseBoxedCodeString(inputString: string): CodeContent {
  try {
    // First remove the outer quotes if they exist
    let processedString = inputString.trim();
    if (processedString.startsWith('"') && processedString.endsWith('"')) {
      processedString = processedString.slice(1, -1);
    }
    
    // Replace the \\boxed{ with { to make it valid JSON
    processedString = processedString.replace(/\\boxed{/g, '{');
    
    // Unescape all double backslashes (\\n -> \n)
    processedString = processedString.replace(/\\\\/g, '\\');
    
    // Parse the JSON string
    const result = JSON.parse(processedString);
    
    return {
      html: result.html || '',
      css: result.css || '',
      javascript: result.javascript || ''
    };
  } catch (error) {
    console.error("Error parsing the boxed string:", error);
    
    // If it fails, try a more manual approach
    try {
      // Extract content between the first { and last }
      const contentMatch = inputString.match(/\\boxed{([\s\S]*)}$/);
      if (contentMatch && contentMatch[1]) {
        let content = contentMatch[1].trim();
        
        // Extract the HTML, CSS, and JavaScript properties using regex
        const htmlMatch = content.match(/"html":\s*"([\s\S]*?)(?<!\\)",/);
        const cssMatch = content.match(/"css":\s*"([\s\S]*?)(?<!\\)",/);
        const jsMatch = content.match(/"javascript":\s*"([\s\S]*?)(?<!\\)"/);
        
        return {
          html: htmlMatch ? htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '',
          css: cssMatch ? cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '',
          javascript: jsMatch ? jsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : ''
        };
      }
      throw new Error("Could not extract content from the boxed format");
    } catch (fallbackError) {
      console.error("Fallback parsing also failed:", fallbackError);
      throw new Error("Failed to parse the input string. The format might be more complex than expected.");
    }
  }
}

// Now with proper type annotations
const MessageDisplay = ({ message }: MessageDisplayProps) => {
  const [codeContent, setCodeContent] = useState<CodeContent>({ html: '', css: '', javascript: '' });
  const [parseError, setParseError] = useState<string | null>(null);
  
  useEffect(() => {
    if (message.content) {
      try {
        // First try to parse as regular JSON
        const parsedContent = JSON.parse(message.content);
        if (typeof parsedContent === 'object' && parsedContent !== null) {
          setCodeContent({
            html: parsedContent.html || '',
            css: parsedContent.css || '',
            javascript: parsedContent.javascript || ''
          });
          setParseError(null);
          return;
        }
      } catch (error) {
        // If direct parsing fails, continue to more complex parsing
      }
      
      // Check if the content is the boxed JSON structure
      if (message.content.includes('\\boxed{')) {
        try {
          const parsedContent = parseBoxedCodeString(message.content);
          setCodeContent(parsedContent);
          setParseError(null);
        } catch (error) {
          console.error("Error parsing content:", error);
          setParseError("Failed to parse the message content.");
          setCodeContent({ html: message.content, css: '', javascript: '' });
        }
      } else {
        // For non-JSON content, just display it as HTML
        setCodeContent({ html: message.content, css: '', javascript: '' });
        setParseError(null);
      }
    }
  }, [message.content]);
  
  return (
    <div className="code-tabs-container">
      {parseError && (
        <div className="error-message bg-red-100 text-red-800 p-2 mb-4 rounded">
          {parseError}
        </div>
      )}
      
      <Tabs defaultValue="html" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="mt-4">
          {renderCode(codeContent.html, 'html')}
        </TabsContent>
        
        <TabsContent value="css" className="mt-4">
          {renderCode(codeContent.css, 'css')}
        </TabsContent>
        
        <TabsContent value="javascript" className="mt-4">
          {renderCode(codeContent.javascript, 'javascript')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to escape HTML
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const renderCode = (code: string, language: string) => {
  if (!code) return null;
  return (
    <Highlight theme={themes.github} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className="h-full overflow-auto p-4 rounded-lg bg-gray-100" style={style}>
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

export default MessageDisplay;