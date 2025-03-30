import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const MARKDOWN_CHUNKS = [
  "# Markdown Streaming Demo\n\n",
  "This is a demonstration of *real-time* markdown streaming.\n\n",
  "## Features\n\n",
  "* Content arrives in chunks\n",
  "* Markdown is parsed as it arrives\n",
  "* The page updates in real-time\n\n",
  "### Code Example\n\n",
  "```javascript\n",
  "function streamMarkdown() {\n",
  "  // This code is streamed chunk by chunk\n",
  "  console.log('Streaming markdown!');\n",
  "}\n",
  "```\n\n",
  "## Conclusion\n\n",
  "This demonstrates how the markdown-streaming-parser can be used to render markdown content as it arrives, without waiting for the entire document.\n"
];

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Stream markdown content
  if (req.url === '/api/markdown-stream') {
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    let chunkIndex = 0;
    
    const streamInterval = setInterval(() => {
      if (chunkIndex < MARKDOWN_CHUNKS.length) {
        res.write(MARKDOWN_CHUNKS[chunkIndex]);
        chunkIndex++;
      } else {
        clearInterval(streamInterval);
        res.end();
      }
    }, 500); // Stream a chunk every 500ms
    
    // Handle client disconnect
    req.on('close', () => {
      clearInterval(streamInterval);
    });
    
    return;
  }
  
  // For other routes, we'll leave handling to Vite dev server
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Markdown API server running at http://localhost:${PORT}/api/markdown-stream`);
  console.log(`Frontend is served by Vite on a different port`);
});
