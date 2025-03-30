/** 
 * Author: Roshan Swain
 * Email: swainroshan@gmail.com
 */

import { Tokenizer, TokenType } from '../src/tokenizer';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  it('should tokenize basic markdown content', () => {
    const input = '# Hello\nWorld!\n```code```\n*emphasis*\n';
    const tokens = tokenizer.tokenize(input, true);

    // Compare token types and contents, not exact array structure
    expect(tokens.length).toBe(5);
    expect(tokens[0]).toEqual({ type: TokenType.HEADER, content: '# Hello' });
    expect(tokens[1]).toEqual({ type: TokenType.TEXT, content: '\nWorld!\n' });
    expect(tokens[2]).toEqual({ type: TokenType.CODE_BLOCK, content: '```code```' });
    expect(tokens[3]).toEqual({ type: TokenType.TEXT, content: '\n' });
    expect(tokens[4]).toEqual({ type: TokenType.EMPHASIS, content: '*emphasis*' });
  });

  it('should handle streaming content', () => {
    // In streaming mode, incomplete headers are stored as pending
    const chunk1 = '# He';
    let tokens = tokenizer.tokenize(chunk1, false);
    expect(tokens).toEqual([]); // Should be empty as it's an incomplete header

    // Still incomplete
    const chunk2 = 'llo';
    tokens = tokenizer.tokenize(chunk2, false);
    expect(tokens).toEqual([]); // Should still be empty

    // Now we have a complete header with text
    const chunk3 = '\nWorld!';
    tokens = tokenizer.tokenize(chunk3, true);
    
    // Verify token types and content
    expect(tokens.length).toBe(2);
    expect(tokens[0]).toEqual({ type: TokenType.HEADER, content: '# Hello' });
    expect(tokens[1]).toEqual({ type: TokenType.TEXT, content: '\nWorld!' });
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
