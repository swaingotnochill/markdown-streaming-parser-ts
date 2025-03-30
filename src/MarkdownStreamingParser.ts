/** 
 * Author: Roshan Swain
 * Email: swainroshan@gmail.com
 */

import { Transform, TransformCallback, TransformOptions } from "stream";
import { Parser, ParserOptions } from "./parser";
import { Tokenizer } from "./tokenizer";
import { Transformer } from "./transform";
import { HTMLRenderer } from "./renderer";

export interface MarkdownParserOptions extends TransformOptions {
  parserOptions?: Partial<ParserOptions>;
}

export class MarkdownStreamingParser extends Transform {
  private buffer: string;
  private tokenizer: Tokenizer;
  private parser: Parser;
  private transformer: Transformer;
  private renderer: HTMLRenderer;
  private parserOptions?: Partial<ParserOptions>;

  constructor(options?: MarkdownParserOptions) {
    super({ ...options, objectMode: false });
    this.buffer = "";
    this.tokenizer = new Tokenizer();
    this.parserOptions = options?.parserOptions;
    this.parser = new Parser([], this.parserOptions);
    this.transformer = new Transformer();
    this.renderer = new HTMLRenderer();
  }

  _transform(chunk: Buffer | string, encoding: string, callback: TransformCallback): void {
    try {
      const stringChunk = Buffer.isBuffer(chunk) ? chunk.toString() : chunk as string;
      this.buffer += stringChunk;
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  _flush(callback: TransformCallback): void {
    try {
      if (this.buffer.length > 0) {
        // Process the entire buffer at the end
        const tokens = this.tokenizer.tokenize(this.buffer, true);
        if (tokens.length > 0) {
          const ast = this.parser.parse(tokens);
          const renderTree = this.transformer.transform(ast);
          const html = this.renderer.render(renderTree);
          if (html) {
            this.push(html);
          }
        }
        this.buffer = "";
      }
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  reset(): void {
    this.buffer = "";
    this.tokenizer = new Tokenizer();
    this.parser = new Parser([], this.parserOptions);
  }
}
