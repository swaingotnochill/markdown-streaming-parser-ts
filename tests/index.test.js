"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const stream_1 = require("stream");
describe('MarkdownStreamParser', () => {
    it('should parse through markdown content without transformation', (done) => {
        const input = '# Hello\nWorld!';
        const expected = '# Hello\nWorld!';
        const readable = new stream_1.Readable();
        readable._read = () => { }; // _read is required but we don't need it for this test.
        readable.push(input);
        readable.push(null); // Mark the end of the stream.
        const parser = new index_1.default();
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
