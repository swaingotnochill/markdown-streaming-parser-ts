/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { Token, TokenType } from "./token";

/**
 * Enum: TokenizerState.
 * 
 * Enumerates the different states of the tokenizer.
 * 
 * @since 0.0.1
 */
enum TokenizerState {
  TEXT,
  HEADER,
  CODE_BLOCK,
  EMPHASIS
}

/**
 * class : Tokenizer
 * 
 * This is the main tokenizer class which converts the input text/buffer into corresponding tokens.
 * 
 * @since 0.0.1
 */
export class Tokenizer {
  private buffer: string;
  private position: number;
  private state: TokenizerState;
  private startPosition: number;

  constructor() {
    this.buffer = "";
    this.position = 0;
    this.startPosition = 0;
    this.state = TokenizerState.TEXT;
  }

  private peek(ahead: number = 1): string {
    if (this.position + ahead > this.buffer.length) return '';
    return this.buffer.slice(this.position, this.position + ahead);
  }

  private createToken(type: TokenType): Token {
    const content = this.buffer.slice(this.startPosition, this.position);
    this.startPosition = this.position;
    return { type, content };
  }

  tokenize(input: string, isEnd: boolean): Token[] {
    this.buffer += input;
    const tokens: Token[] = [];

    while (this.position < this.buffer.length) {
      const char = this.buffer[this.position];

      switch (this.state) {
        case TokenizerState.TEXT:
          if (char === '#') {
            if (this.position > this.startPosition) {
              tokens.push(this.createToken(TokenType.TEXT));
            }
            this.state = TokenizerState.HEADER;
            this.startPosition = this.position;
          } else if (char === '`' && this.peek(3) === '```') {
            if (this.position > this.startPosition) {
              tokens.push(this.createToken(TokenType.TEXT));
            }
            this.state = TokenizerState.CODE_BLOCK;
            this.startPosition = this.position;
          } else if (char === '*' || char === '_') {
            if (this.position > this.startPosition) {
              tokens.push(this.createToken(TokenType.TEXT));
            }
            this.state = TokenizerState.EMPHASIS;
            this.startPosition = this.position;
          } else {
            this.position++;
          }
          break;

        case TokenizerState.HEADER:
          if (char === '\n' || (isEnd && this.position === this.buffer.length - 1)) {
            this.position++;
            tokens.push(this.createToken(TokenType.HEADER));
            this.state = TokenizerState.TEXT;
          } else {
            this.position++;
          }
          break;

        case TokenizerState.CODE_BLOCK:
          if (this.peek(3) === '```' && (this.position > this.startPosition + 2)) {
            this.position += 3;
            tokens.push(this.createToken(TokenType.CODE_BLOCK));
            this.state = TokenizerState.TEXT;
          } else {
            this.position++;
          }
          break;

        case TokenizerState.EMPHASIS:
          const marker = this.buffer[this.startPosition];
          if (char === marker && this.position > this.startPosition) {
            this.position++;
            tokens.push(this.createToken(TokenType.EMPHASIS));
            this.state = TokenizerState.TEXT;
          } else if (char === '\n' || (isEnd && this.position === this.buffer.length - 1)) {
            // If we hit a newline without finding the closing marker, treat it as text
            this.state = TokenizerState.TEXT;
            this.position = this.startPosition + 1;
          } else {
            this.position++;
          }
          break;
      }
    }

    // If we're at the end of input, emit any remaining content as a token
    if (isEnd && this.position > this.startPosition) {
      tokens.push(this.createToken(this.state === TokenizerState.TEXT ? TokenType.TEXT : TokenType.EMPHASIS));
    }

    // Only clear the buffer if we're at the end
    if (isEnd) {
      this.buffer = "";
      this.position = 0;
      this.startPosition = 0;
      this.state = TokenizerState.TEXT;
    }

    return tokens;
  }
}
