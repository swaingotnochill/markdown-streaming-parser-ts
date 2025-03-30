/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { Tokenizer } from "../src/tokenizer";
import { TokenType } from "../src/token";

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  it('should tokenize basic markdown content', () => {
    const input = '# Hello\nWorld!\n```code```\n*emphasis*';
    const tokens = tokenizer.tokenize(input, true);

    expect(tokens).toEqual([
      { type: TokenType.HEADER, content: '# Hello' },
      { type: TokenType.TEXT, content: '\nWorld!\n' },
      { type: TokenType.CODE_BLOCK, content: '```code```' },
      { type: TokenType.TEXT, content: '\n' },
      { type: TokenType.EMPHASIS, content: '*emphasis*' },
    ]);
  });

  it('should handle streaming content', () => {
    const chunk1 = '# He';
    const chunk2 = 'llo\nWor';
    const chunk3 = 'ld!';

    let tokens = tokenizer.tokenize(chunk1, false);
    expect(tokens).toEqual([]); // Not enough content to make a complete token

    tokens = tokenizer.tokenize(chunk2, false);
    expect(tokens).toEqual([
      { type: TokenType.HEADER, content: '# Hello' }
    ]);

    tokens = tokenizer.tokenize(chunk3, true);
    expect(tokens).toEqual([
      { type: TokenType.TEXT, content: '\nWorld!' }
    ]);
  });

  it('should handle code blocks with language', () => {
    const input = '```typescript\nconst x = 42;\n```';
    const tokens = tokenizer.tokenize(input, true);

    expect(tokens).toEqual([
      { type: TokenType.CODE_BLOCK, content: '```typescript\nconst x = 42;\n```' }
    ]);
  });

  it('should handle emphasis markers', () => {
    const input = 'This is *emphasized* and _also emphasized_';
    const tokens = tokenizer.tokenize(input, true);

    expect(tokens).toEqual([
      { type: TokenType.TEXT, content: 'This is ' },
      { type: TokenType.EMPHASIS, content: '*emphasized*' },
      { type: TokenType.TEXT, content: ' and ' },
      { type: TokenType.EMPHASIS, content: '_also emphasized_' }
    ]);
  });
});
