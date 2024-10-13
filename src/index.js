"use strict";
/**
Author: Roshan Swain
Email: swainroshan@gmail.com
*/
const stream_1 = require("stream");
/**
 * Class: MarkdownStreamParser.
 * Extends Node.js Transform stream.
 *
 * A Node.js Transform stream that parses markdown and emits tokens.
 *
 * Transform stream can be used to parse large markdown files efficiently.
 * It's a duplex stream that can both read and write data. Transform streams are a
 * type of Duplex stream where the output is computed based on the input.
 * They implement both Readable and Writable interfaces.
 *
 * Key characteristics of Transform streams:
 * 1. They have separate internal buffers for both reading and writing.
 * 2. They allow for data transformation as it passes through the stream.
 * 3. They can be used for tasks like parsing, encoding, or compressing data on-the-fly.
 *
 * In the context of markdown parsing:
 * - Input: Raw markdown text
 * - Transformation: Parsing markdown into tokens or HTML
 * - Output: Parsed tokens or rendered HTML
 *
 * This approach is memory-efficient for large files as it processes data in chunks,
 * rather than loading the entire file into memory at once.
 * @since 0.0.1
 */
class MarkdownStreamParser extends stream_1.Transform {
    constructor(options) {
        super(options);
        this.buffer = "";
    }
    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();
        this.processBuffer();
        callback();
    }
    _flush(callback) {
        this.processBuffer(true);
        callback();
    }
    processBuffer(isEnd = false) {
        // TODO: Implement the actual markdown parsing logic here.
        // For now we will just log the buffer content.
        if (this.buffer.length > 0) {
            this.push(this.buffer);
            this.buffer = "";
        }
    }
}
module.exports = MarkdownStreamParser;
