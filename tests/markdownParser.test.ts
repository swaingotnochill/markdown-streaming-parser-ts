/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { MarkdownStreamingParser } from '../src/MarkdownStreamingParser';
import { Readable } from "stream";

describe('MarkdownStreamingParser', () => {
  it('should parse markdown content to HTML', (done) => {
    const input = '# Hello\nWorld!\n```code```\n*emphasis*';
    const parser = new MarkdownStreamingParser();
    const chunks: string[] = [];

    parser.on('error', (err) => {
      done(err);
    });

    parser.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });

    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<h1>');
      expect(result).toContain('Hello');
      expect(result).toContain('<p>');
      expect(result).toContain('World!');
      expect(result).toContain('<pre><code>code</code></pre>');
      expect(result).toContain('<em>');
      expect(result).toContain('emphasis');
      done();
    });

    parser.write(input);
    parser.end();
  });

  it('should handle streaming content character by character', (done) => {
    const input = '# Hello\nWorld!';
    const parser = new MarkdownStreamingParser();
    const chunks: string[] = [];

    parser.on('error', (err) => {
      done(err);
    });

    parser.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });

    parser.on('end', () => {
      const result = chunks.join('');
      expect(result).toContain('<h1>');
      expect(result).toContain('Hello');
      expect(result).toContain('<p>');
      expect(result).toContain('World!');
      done();
    });

    // Stream the content character by character
    for (const char of input.split('')) {
      parser.write(char);
    }
    parser.end();
  });

  it('should reset parser state between documents', (done) => {
    // First document
    const parser1 = new MarkdownStreamingParser();
    const chunks1: string[] = [];

    parser1.on('error', (err) => {
      done(err);
    });

    parser1.on('data', (chunk) => {
      chunks1.push(chunk.toString());
    });

    parser1.on('end', () => {
      const result1 = chunks1.join('');
      expect(result1).toContain('<h1>');
      expect(result1).toContain('First document');

      // Second document
      const parser2 = new MarkdownStreamingParser();
      const chunks2: string[] = [];

      parser2.on('error', (err) => {
        done(err);
      });

      parser2.on('data', (chunk) => {
        chunks2.push(chunk.toString());
      });

      parser2.on('end', () => {
        const result2 = chunks2.join('');
        expect(result2).toContain('<h1>');
        expect(result2).toContain('Second document');
        done();
      });

      parser2.write('# Second document');
      parser2.end();
    });

    parser1.write('# First document');
    parser1.end();
  });
});
