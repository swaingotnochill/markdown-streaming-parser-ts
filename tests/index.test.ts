import MarkdownStreamParser from "../src/index";
import { Readable } from "stream";

describe('MarkdownStreamParser', () => {
	it('should parse through markdown content without transformation', (done) => {
		const input = '# Hello\nWorld!';
		const expected = '# Hello\nWorld!';

		const readable = new Readable();
		readable._read = () => {}; // _read is required but we don't need it for this test.
		readable.push(input);
		readable.push(null); // Mark the end of the stream.

		const parser = new MarkdownStreamParser();
		let result = '';

		readable.pipe(parser)
			.on('data', (chunk) => {
				result += chunk.toString();
			})
			.on('end', () => {
				expect(result).toBe(expected);
				done();
			});
	});
});