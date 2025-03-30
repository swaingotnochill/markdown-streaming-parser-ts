import { createMarkdownParser } from './src/client-parser.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const rawMarkdownElement = document.getElementById('raw-markdown');
  const renderedHtmlElement = document.getElementById('rendered-html');
  const startStreamButton = document.getElementById('start-stream');
  const resetButton = document.getElementById('reset');
  
  // Variables
  let markdownParser = null;
  let rawMarkdownContent = '';
  
  // Event Listeners
  startStreamButton.addEventListener('click', startStreaming);
  resetButton.addEventListener('click', resetDemo);
  
  function startStreaming() {
    // Disable start button while streaming
    startStreamButton.disabled = true;
    
    // Reset content
    rawMarkdownContent = '';
    rawMarkdownElement.textContent = '';
    renderedHtmlElement.innerHTML = '';
    
    // Create a new parser instance
    markdownParser = createMarkdownParser();
    
    // Handle parsed HTML output
    markdownParser.on('data', chunk => {
      renderedHtmlElement.innerHTML += chunk.toString();
    });
    
    // Fetch the markdown stream
    fetchMarkdownStream();
  }
  
  async function fetchMarkdownStream() {
    try {
      // Fetch the markdown stream from our API
      const response = await fetch('/api/markdown-stream');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get a reader from the response body stream
      const reader = response.body.getReader();
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream complete');
          startStreamButton.disabled = false;
          break;
        }
        
        // Convert the chunk to text
        const chunkText = new TextDecoder().decode(value);
        
        // Update the raw markdown display
        rawMarkdownContent += chunkText;
        rawMarkdownElement.textContent = rawMarkdownContent;
        
        // Feed the chunk to our parser
        markdownParser.write(chunkText);
      }
      
      // End the parser stream
      markdownParser.end();
      
    } catch (error) {
      console.error('Error fetching markdown stream:', error);
      startStreamButton.disabled = false;
    }
  }
  
  function resetDemo() {
    // Reset everything
    rawMarkdownContent = '';
    rawMarkdownElement.textContent = '';
    renderedHtmlElement.innerHTML = '';
    startStreamButton.disabled = false;
    
    // If there's an active parser, reset it
    if (markdownParser) {
      markdownParser.end();
      markdownParser = null;
    }
  }
});
