/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/


import { MarkdownStreamParser } from "../src/MarkdownStreamingParser";
import { Readable } from "stream";
import { Token, TokenType } from "../src/token";

describe('MarkdownStreamParser', () => {
	it('should tokenize markdown content', (done) => {
		const input = '# Hello\nWorld!\n```code```\n*emphasis*';

		// Returns an array of tokens after tokenizer.
		const expected =  [
			{type: TokenType.HEADER, content: '# Hello' },
			{type: TokenType.TEXT, content: '\nWorld!\n'},
			{type: TokenType.CODE_BLOCK, content: '```code```'},
			{type: TokenType.TEXT, content: '\n'},
			{type: TokenType.EMPHASIS, content: '*emphasis*' },
		];

		const readable = new Readable();
		readable._read = () => {}; 	
		readable.push(input);
		readable.push(null); // Mark the end of the stream.

		const parser = new MarkdownStreamParser();
		let result: Token[] = [];

		readable.pipe(parser)
			.on('data', (chunk) => {
				result.push(JSON.parse(chunk));
			})
			.on('end', () => {
				expect(result).toEqual(expected);
				done();
			});
	});
});