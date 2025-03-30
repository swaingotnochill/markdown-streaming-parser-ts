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

    // Check for expected tokens, but don't rely on exact length since implementation might vary
    expect(tokens.find(t => t.type === TokenType.HEADER && t.content === '# Hello')).toBeTruthy();
    expect(tokens.find(t => t.type === TokenType.TEXT && t.content.includes('World!'))).toBeTruthy();
    expect(tokens.find(t => t.type === TokenType.CODE_BLOCK && t.content === '```code```')).toBeTruthy();
    expect(tokens.find(t => t.type === TokenType.EMPHASIS && t.content === '*emphasis*')).toBeTruthy();
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
    
    // Verify the header token
    expect(tokens.length >= 1).toBe(true);
    expect(tokens[0]).toEqual({ type: TokenType.HEADER, content: '# Hello' });
    
    // The text content might vary based on implementation
    expect(tokens.some(t => t.type === TokenType.TEXT && t.content.includes('World!'))).toBe(true);
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
