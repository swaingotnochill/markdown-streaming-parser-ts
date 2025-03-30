const http = require('http');
const fs = require('fs');
const path = require('path');

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

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.md': 'text/markdown',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Stream markdown content
  if (req.url === '/api/markdown-stream') {
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
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
  
  // Serve static files
  let filePath = req.url;
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  filePath = path.join(__dirname, '..', filePath);
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = CONTENT_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
