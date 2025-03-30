import { Parser, NodeType } from "../src/parser";
import { Token, TokenType } from "../src/token";

describe('AST Parser', () => {
	it('should generate correct AST for simple markdown', () => {
		const tokens: Token[] = [
			{ type: TokenType.HEADER, content: '# Hello' },
			{ type: TokenType.TEXT, content: '\nWorld!\n' },
			{ type: TokenType.CODE_BLOCK, content: '```code```' },
			{ type: TokenType.TEXT, content: '\n' },
			{ type: TokenType.EMPHASIS, content: '*emphasis*' },
		];

		const expectedAST = {
			type: NodeType.DOCUMENT,
			children: [
				{
					type: NodeType.HEADER,
					children: [{ type: NodeType.TEXT, value: 'Hello' }],
					metadata: { level: 1 }
				},
				{
					type: NodeType.PARAGRAPH,
					children: [{ type: NodeType.TEXT, value: 'World!' }],
				},
				{
					type: NodeType.CODE_BLOCK,
					value: 'code',
					metadata: { language: null },
				},
				{
					type: NodeType.EMPHASIS,
					children: [{ type: NodeType.TEXT, value: 'emphasis' }]
				}
			]
		};

		const parser = new Parser(tokens);
		const ast = parser.parse();
		expect(ast).toEqual(expectedAST);
	});
});

describe('AST Parser', () => {
	it('should generate correct AST with line breaks in default behavior', () => {
		const tokens: Token[] = [
			{ type: TokenType.HEADER, content: '# Hello' },
			{ type: TokenType.TEXT, content: 'First line\nSecond line\n Third line' },
			{ type: TokenType.CODE_BLOCK, content: '```bash\necho "hello"\nworld\n```' },
			{ type: TokenType.TEXT, content: '\n' },
			{ type: TokenType.EMPHASIS, content: '*emphasized\ntext*' },
		];

		const expectedAST = {
			type: NodeType.DOCUMENT,
			children: [
				{
					type: NodeType.HEADER,
					children: [{ type: NodeType.TEXT, value: 'Hello' }],
					metadata: { level: 1 }
				},
				{
					type: NodeType.PARAGRAPH,
					children: [
						{ type: NodeType.TEXT, value: 'First line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Second line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Third line' }
					]
				},
				{
					type: NodeType.CODE_BLOCK,
					value: 'echo "hello"\nworld', // preserves the exact newlines.
					metadata: { language: 'bash' }
				},
				{
					type: NodeType.EMPHASIS,
					children: [
						{ type: NodeType.TEXT, value: 'emphasized' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'text' }
					]
				}
			]
		}

		const parser = new Parser(tokens);
		const ast = parser.parse();
		expect(ast).toEqual(expectedAST);
	});
});

describe('AST Parser', () => {
	it('should generate correct AST with line breaks preserve using empty paragraph', () => {
		const tokens: Token[] = [
			{ type: TokenType.HEADER, content: '# Hello' },
			{ type: TokenType.TEXT, content: 'First line\nSecond line\n Third line' },
			{ type: TokenType.CODE_BLOCK, content: '```bash\necho "hello"\nworld\n```' },
			{ type: TokenType.TEXT, content: '\n' },
			{ type: TokenType.EMPHASIS, content: '*emphasized\ntext*' },
		];

		const expectedAST = {
			type: NodeType.DOCUMENT,
			children: [
				{
					type: NodeType.HEADER,
					children: [{ type: NodeType.TEXT, value: 'Hello' }],
					metadata: { level: 1 }
				},
				{
					type: NodeType.PARAGRAPH,
					children: [
						{ type: NodeType.TEXT, value: 'First line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Second line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Third line' }
					]
				},
				{
					type: NodeType.CODE_BLOCK,
					value: 'echo "hello"\nworld', // preserves the exact newlines.
					metadata: { language: 'bash' }
				},
				{
					type: NodeType.PARAGRAPH,
					children: [{ type: NodeType.LINEBREAK }]
				},
				{
					type: NodeType.EMPHASIS,
					children: [
						{ type: NodeType.TEXT, value: 'emphasized' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'text' }
					]
				}
			]
		}

		const parser = new Parser(tokens, {
			whitespaceMode: 'preserve',
			defaultLineBreaks: 'paragraph',
		});
		const ast = parser.parse();
		expect(ast).toEqual(expectedAST);
	});
});

describe('AST Parser', () => {
	it('should generate correct AST with line breaks with default whitespace mode (structural) ', () => {
		const tokens: Token[] = [
			{ type: TokenType.HEADER, content: '# Hello' },
			{ type: TokenType.TEXT, content: 'First line\nSecond line\n Third line' },
			{ type: TokenType.CODE_BLOCK, content: '```bash\necho "hello"\nworld\n```' },
			{ type: TokenType.TEXT, content: '\n' },
			{ type: TokenType.EMPHASIS, content: '*emphasized\ntext*' },
		];

		const expectedAST = {
			type: NodeType.DOCUMENT,
			children: [
				{
					type: NodeType.HEADER,
					children: [{ type: NodeType.TEXT, value: 'Hello' }],
					metadata: { level: 1 }
				},
				{
					type: NodeType.PARAGRAPH,
					children: [
						{ type: NodeType.TEXT, value: 'First line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Second line' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'Third line' }
					]
				},
				{
					type: NodeType.CODE_BLOCK,
					value: 'echo "hello"\nworld', // preserves the exact newlines.
					metadata: { language: 'bash' }
				},
				{
					type: NodeType.LINEBREAK,
				},
				{
					type: NodeType.EMPHASIS,
					children: [
						{ type: NodeType.TEXT, value: 'emphasized' },
						{ type: NodeType.LINEBREAK },
						{ type: NodeType.TEXT, value: 'text' }
					]
				}
			]
		}

		const parser = new Parser(tokens, {
			whitespaceMode: 'preserve',
		});
		const ast = parser.parse();
		expect(ast).toEqual(expectedAST);
	});
});
