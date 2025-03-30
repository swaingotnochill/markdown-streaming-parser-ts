/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { Transform } from "stream";
import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";
import { Transformer } from "./transform";
import { HTMLRenderer } from "./renderer";

export class MarkdownStreamingParser extends Transform {
  private buffer: string;
  private tokenizer: Tokenizer;
  private parser: Parser;
  private transformer: Transformer;
  private renderer: HTMLRenderer;

  constructor() {
    super();
    this.buffer = "";
    this.tokenizer = new Tokenizer();
    this.parser = new Parser();
    this.transformer = new Transformer();
    this.renderer = new HTMLRenderer();
  }

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    this.buffer += chunk.toString();
    this.processBuffer(false);
    callback();
  }

  _flush(callback: Function) {
    this.processBuffer(true);
    callback();
  }

  reset() {
    this.buffer = "";
    this.tokenizer = new Tokenizer();
    this.parser = new Parser();
  }

  private processBuffer(isEnd = false): void {
    const tokens = this.tokenizer.tokenize(this.buffer, isEnd);
    const ast = this.parser.parse(tokens); // Parser will reuse its instance and just update tokens.
    const renderTree = this.transformer.transform(ast);
    const html = this.renderer.render(renderTree);
    this.push(html);
    this.buffer = isEnd ? "" : this.buffer;
  }
}
