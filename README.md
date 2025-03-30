# Markdown Streaming Parser

A lightweight, memory-efficient streaming parser for Markdown content that supports real-time rendering.

## Features

- Stream-based processing for Markdown content
- Memory efficient for large documents
- Real-time rendering of content as it arrives
- Support for basic Markdown elements (headers, paragraphs, code blocks, emphasis)
- Customizable rendering options

## Installation

```bash
npm install markdown-streaming-parser
```

## Basic Usage

```typescript
import { MarkdownStreamingParser } from 'markdown-streaming-parser';
import { createReadStream } from 'fs';

// Create a streaming parser
const parser = new MarkdownStreamingParser();

// Set up data handling
parser.on('data', (html) => {
  console.log('Rendered HTML:', html);
});

// Create a readable stream from a Markdown file
const markdownStream = createReadStream('document.md', 'utf-8');

// Pipe the Markdown content through the parser
markdownStream.pipe(parser);
```

## API Reference

### MarkdownStreamingParser

The main class that handles streaming of markdown content and transforms it into HTML.

```typescript
import { MarkdownStreamingParser, MarkdownParserOptions } from 'markdown-streaming-parser';

// Create with default options
const parser = new MarkdownStreamingParser();

// Or with custom options
const parserWithOptions = new MarkdownStreamingParser({
  parserOptions: {
    // Custom parser options
  }
});
```

#### Methods

- `write(chunk: string | Buffer)`: Write a chunk of markdown content to the parser
- `end()`: Signal the end of the markdown content
- `reset()`: Reset the parser state

### Usage with Web Streams

You can use this parser with the Web Streams API for browser-based applications:

```typescript
// Example with fetch and streams
async function fetchAndParseMarkdown(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const parser = new MarkdownStreamingParser();
  
  // Process the stream
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    // Convert Uint8Array to string and feed to parser
    const chunk = new TextDecoder().decode(value);
    parser.write(chunk);
  }
  
  parser.end();
}
```

## Example

See the [example](./example) directory for a complete example of a server streaming markdown content to a browser client.

## License

MIT

Author:
Roshan Swain
Email: swainroshan@gmail.com
Github: https://github.com/swaingotnochill
Twitter: https://twitter.com/@pucchkaa
