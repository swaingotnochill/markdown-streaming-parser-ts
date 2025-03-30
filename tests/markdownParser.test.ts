/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/
import { MarkdownStreamingParser } from "../src/MarkdownStreamingParser";
import { Readable } from "stream";

describe('MarkdownStreamingParser', () => {
  it('should parse markdown content to HTML', (done) => {
    const input = '# Hello\nWorld!\n```code```\n*emphasis*';

    const expectedHtml =
      '<div class="markdown-content">' +
      '<h1><span>Hello</span></h1>' +
      '<p><span>World!</span></p>' +
      '<pre><code>code</code></pre>' +
      '<em><span>emphasis</span></em>' +
      '</div>';

    const readable = new Readable();
    readable._read = () => { };
    readable.push(input);
    readable.push(null); // Mark the end of the stream

    const parser = new MarkdownStreamingParser();
    const chunks: string[] = [];

    readable.pipe(parser)
      .on('data', (chunk) => {
        chunks.push(chunk.toString());
      })
      .on('end', () => {
        const result = chunks.join('');
        expect(result).toBe(expectedHtml);
        done();
      });
  });

  it('should handle streaming content character by character', (done) => {
    const input = '# Hello\nWorld!';
    const expectedHtml =
      '<div class="markdown-content">' +
      '<h1><span>Hello</span></h1>' +
      '<p><span>World!</span></p>' +
      '</div>';

    const readable = new Readable();
    readable._read = () => { };

    // Stream character by character
    input.split('').forEach(char => readable.push(char));
    readable.push(null);

    const parser = new MarkdownStreamingParser();
    const chunks: string[] = [];

    readable.pipe(parser)
      .on('data', (chunk) => {
        chunks.push(chunk.toString());
      })
      .on('end', () => {
        const result = chunks.join('');
        expect(result).toBe(expectedHtml);
        done();
      });
  });

  it('should reset parser state between documents', (done) => {
    const parser = new MarkdownStreamingParser();
    const chunks: string[] = [];

    parser.on('data', (chunk) => chunks.push(chunk.toString()));

    parser.write('# First document\n');
    parser.end(() => {
      const firstResult = chunks.join('');
      expect(firstResult).toBe(
        '<div class="markdown-content">' +
        '<h1><span>First document</span></h1>' +
        '</div>'
      );

      // Reset parser and test again
      chunks.length = 0;
      parser.reset();

      parser.write('# Second document\n');
      parser.end(() => {
        const secondResult = chunks.join('');
        expect(secondResult).toBe(
          '<div class="markdown-content">' +
          '<h1><span>Second document</span></h1>' +
          '</div>'
        );
        done();
      });
    });
  });
});
