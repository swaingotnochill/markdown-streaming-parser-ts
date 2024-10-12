import { Token, TokenType } from "./token";

export class Tokenizer {
	private source: string;
	private position: number;

	constructor(source: string) {
		this.source = source;
		this.position = 0;
	}

	private peek(n: number = 0): string {
		return this.source[this.position + n];
	}

	private consume(n: number = 1): void {
		this.position += n;
	}

	private eof(): boolean {
		return this.position >= this.source.length;
	}

	private consumeUntil(): string {}

	private nextToken(): Token | null {
	}

	private headerToken(): Token {
	}

	private emphasisToken(): Token {
	}

	private linkToken(): Token {
	}

	private codeToken(): Token {}

	private blockQuoteToken(): Token {}

	private listItemToken(): Token {}

	private textToken(): Token {
	}
}
