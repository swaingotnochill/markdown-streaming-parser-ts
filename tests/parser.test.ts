import { MarkdownStreamingParser } from "../src/MarkdownStreamingParser";

describe('MarkdownStreamingParser', () => {
  let parser: MarkdownStreamingParser;

  beforeEach(() => {
    parser = new MarkdownStreamingParser();
  });

  it('should parse basic markdown text', (done) => {
    const chunks: string[] = [];
    parser.on('data', (chunk) => chunks.push(chunk.toString()));
    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<div class="markdown-content">');
      expect(result).toContain('</div>');
      done();
    });

    parser.write('# Hello World\n');
    parser.write('This is a paragraph with *emphasis*.\n');
    parser.write('```javascript\nconst x = 42;\n```');
    parser.end();
  });

  it('should handle streaming content correctly', (done) => {
    const chunks: string[] = [];
    parser.on('data', (chunk) => chunks.push(chunk.toString()));
    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<h1>Hello');
      expect(result).toContain('World</h1>');
      done();
    });

    // Stream the content character by character
    const content = '# Hello\nWorld';
    content.split('').forEach(char => parser.write(char));
    parser.end();
  });

  it('should handle code blocks with language', (done) => {
    const chunks: string[] = [];
    parser.on('data', (chunk) => chunks.push(chunk.toString()));
    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<pre><code class="language-typescript">');
      expect(result).toContain('const x: number = 42;');
      expect(result).toContain('</code></pre>');
      done();
    });

    parser.write('```typescript\nconst x: number = 42;\n```');
    parser.end();
  });

  it('should handle emphasis correctly', (done) => {
    const chunks: string[] = [];
    parser.on('data', (chunk) => chunks.push(chunk.toString()));
    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<em>emphasized text</em>');
      done();
    });

    parser.write('This has *emphasized text* in it.');
    parser.end();
  });

  it('should reset parser state correctly', (done) => {
    const chunks: string[] = [];
    parser.on('data', (chunk) => chunks.push(chunk.toString()));

    parser.write('# First document\n');
    parser.end(() => {
      const firstResult = chunks.join('');
      expect(firstResult).toContain('<h1>First document</h1>');

      // Reset parser and test again
      chunks.length = 0;
      parser.reset();

      parser.write('# Second document\n');
      parser.end(() => {
        const secondResult = chunks.join('');
        expect(secondResult).toContain('<h1>Second document</h1>');
        done();
      });
    });
  });
});
