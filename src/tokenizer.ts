/** 
 * Author: Roshan Swain
 * Email: swainroshan@gmail.com
 */

export enum TokenType {
  TEXT = 0,
  HEADER = 1,
  CODE_BLOCK = 2,
  EMPHASIS = 3
}

export interface Token {
  type: TokenType;
  content: string;
}

export class Tokenizer {
  private buffer: string;
  private position: number;
  private pendingContent: string;

  constructor() {
    this.buffer = '';
    this.position = 0;
    this.pendingContent = '';
  }

  tokenize(input: string, isEnd: boolean): Token[] {
    // Append incoming content to any pending content
    this.buffer = this.pendingContent + input;
    this.position = 0;
    this.pendingContent = '';
    
    const tokens: Token[] = [];
    
    // Don't attempt to tokenize if we don't have enough content and not at the end
    if (this.buffer.length === 0) {
      return tokens;
    }
    
    // In streaming mode, don't process incomplete headers
    if (!isEnd && this.buffer.indexOf('\n') === -1 && this.buffer.startsWith('#')) {
      this.pendingContent = this.buffer;
      return tokens;
    }

    while (this.position < this.buffer.length) {
      const char = this.buffer[this.position];
      const isAtLineStart = this.position === 0 || this.buffer[this.position - 1] === '\n';

      if (char === '#' && isAtLineStart) {
        this.tokenizeHeader(tokens, isEnd);
      } else if (char === '`' && this.checkTripleBackticks()) {
        this.tokenizeCodeBlock(tokens, isEnd);
      } else if (char === '*' || char === '_') {
        this.tokenizeEmphasis(tokens, isEnd);
      } else {
        this.tokenizeText(tokens);
      }
    }

    // In streaming mode, save any pending content for next chunk
    if (!isEnd && this.pendingContent.length > 0) {
      this.buffer = this.pendingContent;
      this.pendingContent = '';
    }

    return tokens;
  }

  private tokenizeHeader(tokens: Token[], isEnd: boolean): void {
    const start = this.position;
    let endOfHeader = this.buffer.indexOf('\n', start);
    
    // If no newline and not at end, store as pending
    if (endOfHeader === -1 && !isEnd) {
      this.pendingContent = this.buffer.slice(start);
      this.position = this.buffer.length;
      return;
    }
    
    // If no newline but at end, process the full content
    if (endOfHeader === -1 && isEnd) {
      endOfHeader = this.buffer.length;
    }
    
    const content = this.buffer.slice(start, endOfHeader).trim();
    tokens.push({ type: TokenType.HEADER, content });
    
    // Move past the header and newline
    this.position = endOfHeader + 1;
    
    // If there's text after the header, add it as a TEXT token
    if (this.position < this.buffer.length) {
      let nextSpecialChar = this.findNextSpecialCharPosition();
      if (nextSpecialChar === -1) nextSpecialChar = this.buffer.length;
      
      const textContent = this.buffer.slice(this.position, nextSpecialChar);
      if (textContent.length > 0) {
        tokens.push({ type: TokenType.TEXT, content: textContent });
        this.position = nextSpecialChar;
      }
    }
  }

  private tokenizeCodeBlock(tokens: Token[], isEnd: boolean): void {
    const start = this.position;
    const openingBackticks = this.position;
    
    // Skip opening ```
    this.position += 3;
    
    // Find closing ```
    let closingBackticks = this.buffer.indexOf('```', this.position);
    
    // If no closing ``` and not at end, store as pending
    if (closingBackticks === -1 && !isEnd) {
      this.pendingContent = this.buffer.slice(start);
      this.position = this.buffer.length;
      return;
    }
    
    // If no closing ``` but at end, mark the whole rest as code block
    if (closingBackticks === -1 && isEnd) {
      closingBackticks = this.buffer.length - 3;
    }
    
    // Skip to after the closing ```
    this.position = closingBackticks + 3;
    
    const content = this.buffer.slice(openingBackticks, this.position);
    tokens.push({ type: TokenType.CODE_BLOCK, content });
  }

  private tokenizeEmphasis(tokens: Token[], isEnd: boolean): void {
    const start = this.position;
    const marker = this.buffer[this.position];
    
    // Skip opening * or _
    this.position++;
    
    // Find closing * or _
    let closingMarker = this.buffer.indexOf(marker, this.position);
    
    // If no closing marker and not at end, store as pending
    if (closingMarker === -1 && !isEnd) {
      this.pendingContent = this.buffer.slice(start);
      this.position = this.buffer.length;
      return;
    }
    
    // If no closing marker but at end, mark the whole rest as emphasis
    if (closingMarker === -1 && isEnd) {
      closingMarker = this.buffer.length - 1;
    }
    
    // Skip to after the closing marker
    this.position = closingMarker + 1;
    
    const content = this.buffer.slice(start, this.position);
    tokens.push({ type: TokenType.EMPHASIS, content });
  }

  private tokenizeText(tokens: Token[]): void {
    const start = this.position;
    
    // Find the next special character
    const nextPos = this.findNextSpecialCharPosition();
    
    if (nextPos === -1) {
      // No more special characters, consume the rest
      this.position = this.buffer.length;
    } else {
      this.position = nextPos;
    }
    
    if (this.position > start) {
      const content = this.buffer.slice(start, this.position);
      tokens.push({ type: TokenType.TEXT, content });
    }
  }

  private findNextSpecialCharPosition(): number {
    let pos = this.position;
    
    while (pos < this.buffer.length) {
      const char = this.buffer[pos];
      const isAtLineStart = pos === 0 || this.buffer[pos - 1] === '\n';
      
      if ((char === '#' && isAtLineStart) || 
          (char === '`' && this.checkTripleBackticksAt(pos)) || 
          char === '*' || 
          char === '_') {
        return pos;
      }
      
      pos++;
    }
    
    return -1;
  }

  private checkTripleBackticks(): boolean {
    return this.checkTripleBackticksAt(this.position);
  }

  private checkTripleBackticksAt(pos: number): boolean {
    return pos + 2 < this.buffer.length && 
           this.buffer[pos] === '`' && 
           this.buffer[pos + 1] === '`' && 
           this.buffer[pos + 2] === '`';
  }
}
