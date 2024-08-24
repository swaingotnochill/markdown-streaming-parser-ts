"use strict";
const stream_1 = require("stream");
class MarkdownStreamParser extends stream_1.Transform {
    constructor(options) {
        super(options);
        this.buffer = "";
    }
    _transform(chunk, encoding, callback) {
        this.buffer += chunk.toString();
        // TODO: Main parser implementation.
        callback();
    }
    _flush(callback) {
        // TODO: Handle remaining data in the buffer.
        callback();
    }
}
module.exports = MarkdownStreamParser;
