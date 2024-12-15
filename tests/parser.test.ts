import { Parser, NodeType } from "../src/parser";
import { Token, TokenType } from "../src/token";
import util from "util";

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
		console.log(util.inspect(ast, { depth: null, colors: true }));
		expect(ast).toEqual(expectedAST);
	});
});
