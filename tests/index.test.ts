import MarkdownStreamParser from "../src/index";
import { Readable } from "stream";

describe("MarkdownStreamParser", () => {
	it("should parse simple markdown", (done) => {
		const input = "# Hello\nWorld!";
		const expected = "<h1>Hello</h1>\n<p>World</p>";
	});
});
