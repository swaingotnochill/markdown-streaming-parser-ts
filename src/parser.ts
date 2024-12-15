/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { Token, TokenType } from "./token";

export enum NodeType {
	DOCUMENT = 'document',
	PARAGRAPH = 'paragraph',
	TEXT = 'text',
	HEADER = 'header',
	CODE_BLOCK = 'code_block',
	EMPHASIS = 'emphasis',
	LINEBREAK = 'linebreak',
};

export interface ASTNode {
	type: NodeType;
	value?: string;
	children?: ASTNode[];
	metadata?: {
		level?: number;
		language?: string | null;
	};
};

// Parser configuration interface.
export interface ParserOptions {
	whitespaceMode: 'preserve' | 'normalize';
	defaultLineBreaks: 'structural' | 'paragraph';
}

export class Parser {
	private tokens: Token[];
	private current: number = 0;
	private options: ParserOptions;

	constructor(tokens: Token[], options?: Partial<ParserOptions>) {
		this.tokens = tokens;
		this.options = {
			whitespaceMode: 'normalize', // default
			defaultLineBreaks: 'structural',
			...options
		};
	};

	parse(): ASTNode {
		const document: ASTNode = {
			type: NodeType.DOCUMENT,
			children: []
		};

		while (!this.isAtEnd()) {
			const node = this.parseBlock();
			if (node) {
				document.children!.push(node);
			}
		}
		return document;
	}

	private parseBlock(): ASTNode | null {
		const token = this.peek();

		switch (token.type) {
			case TokenType.TEXT:
				return this.parseParagraph();
			case TokenType.HEADER:
				return this.parseHeader();
			case TokenType.CODE_BLOCK:
				return this.parseCodeBlock();
			case TokenType.EMPHASIS:
				return this.parseEmphasis();
			default:
				this.advance(); // skipping unknown tokens for now.
				return this.createTextNode('');
		}
	}

	private parseCodeBlock(): ASTNode {
		const token = this.advance();
		const content = token.content.replace(/^```|```$/g, '');

		// Get the language for the codeblock if there's a new line.
		const hasNewLine = content.includes('\n');
		const language = hasNewLine ? content.split('\n')[0] : null;
		const value = hasNewLine ? content.split('\n').slice(1).join('\n') : content;

		return {
			type: NodeType.CODE_BLOCK,
			value: value.trim(),
			metadata: {
				language,
			},
		};
	}

	private parseEmphasis(): ASTNode {
		const token = this.advance();
		const content = token.content.replace(/^\*|_|\*$|_$/g, '');

		// Split the content by newlines and create text nodes with linebreaks.
		const lines = content.split('\n').filter(line => line.trim());
		const children: ASTNode[] = [];

		lines.forEach((line, index) => {
			if (index > 0) {
				children.push({ type: NodeType.LINEBREAK });
			}
			children.push(this.createTextNode(line.trim()));
		});

		return {
			type: NodeType.EMPHASIS,
			children
		};
	}

	private parseHeader(): ASTNode {
		const token = this.advance();
		const level = (token.content.match(/^#+/) || [''])[0].length;
		const content = token.content.replace(/^#+\s*/, '');

		return {
			type: NodeType.HEADER,
			children: [this.createTextNode(content)],
			metadata: {
				level
			},
		};
	}

	private parseParagraph(): ASTNode | null {
		const token = this.advance();

		// Handle single newline based on configuration.
		if (token.content === '\n') {
			if (this.options.whitespaceMode === 'preserve') {
				return this.options.defaultLineBreaks === 'structural' ? { type: NodeType.LINEBREAK }
					: {
						type: NodeType.PARAGRAPH,
						children: [{ type: NodeType.LINEBREAK }]
					};
			}
			return null; //normalize mode: skip standalone newlines
		}

		const content = token.content.split('\n').filter(line => line.trim());

		// returning null for empty paragraphs (just newlines).
		// will handle new lines later.
		if (!content || content.length === 0) {
			return null;
		}

		// If multiple non-empty lines, create text nodes with line breaks.
		const children: ASTNode[] = [];
		content.forEach((line, index) => {
			if (index > 0) {
				children.push({ type: NodeType.LINEBREAK });
			}
			children.push(this.createTextNode(line.trim()));
		});

		return {
			type: NodeType.PARAGRAPH,
			children
		};
	}

	private createTextNode(content: string): ASTNode {
		return {
			type: NodeType.TEXT,
			value: content,
		};
	}

	private peek(): Token {
		return this.tokens[this.current];
	}

	private advance(): Token {
		if (!this.isAtEnd()) this.current++;
		return this.tokens[this.current - 1];
	}

	private isAtEnd(): boolean {
		return this.current >= this.tokens.length;
	}
};
