"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const stream_1 = require("stream");
const token_1 = require("../src/token");
describe('MarkdownStreamParser', () => {
    it('should tokenize markdown content', (done) => {
        const input = '# Hello\nWorld!\n```code```\n*emphasis*';
        // Returns an array of tokens after tokenizer.
        const expected = [
            { type: token_1.TokenType.HEADER, content: '# Hello' },
            { type: token_1.TokenType.TEXT, content: '\nWorld!\n' },
            { type: token_1.TokenType.CODE_BLOCK, content: '```code```' },
            { type: token_1.TokenType.TEXT, content: '\n' },
            { type: token_1.TokenType.EMPHASIS, content: '*emphasis*' },
        ];
        const readable = new stream_1.Readable();
        readable._read = () => { };
        readable.push(input);
        readable.push(null); // Mark the end of the stream.
        const parser = new index_1.default();
        let result = [];
        readable.pipe(parser)
            .on('data', (chunk) => {
            result.push(JSON.parse(chunk));
        })
            .on('end', () => {
            console.log("DEBUG: Result is : \n", result);
            expect(result).toEqual(expected);
            done();
        });
    });
});
