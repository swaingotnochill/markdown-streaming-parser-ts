"use strict";
/**
Author: Roshan Swain
Email: swainroshan@gmail.com
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokenizer = void 0;
const token_1 = require("./token");
/**
 * Enum: TokenizerState.
 *
 * Enumerates the different states of the tokenizer.
 *
 * @since 0.0.1
 */
var TokenizerState;
(function (TokenizerState) {
    TokenizerState[TokenizerState["TEXT"] = 0] = "TEXT";
    TokenizerState[TokenizerState["HEADER"] = 1] = "HEADER";
    TokenizerState[TokenizerState["CODE_BLOCK"] = 2] = "CODE_BLOCK";
    TokenizerState[TokenizerState["EMPHASIS"] = 3] = "EMPHASIS";
})(TokenizerState || (TokenizerState = {}));
/**
 * class : Tokenizer
 *
 * This is the main tokenizer class which converts the input text/buffer into corresponding tokens.
 *
 * @since 0.0.1
 */
class Tokenizer {
    constructor() {
        this.buffer = "";
        this.position = 0;
        this.state = TokenizerState.TEXT;
    }
    /**
     * Function: tokenize
     *
     * This is the core of the tokenizer, responsible for breaking down the input markdown text
     * into individual tokens.
     *
     * It uses a state machine approach, where the current state determines how each character is interpreted.
     *
     * Workings:
     * 1. It adds new input to existing buffer.
     * 2. It creates an array to store the tokens.
     * 3. It enters a loop that continues as long as there are charactesr in the buffer to process.
     * 4. For each character, it checks the current state of the tokenizer and acts accordingly.
     *
     *
     * @param input
     * @param isEnd
     * @returns Token[]
     *
     * @since 0.0.1
     */
    tokenize(input, isEnd) {
        this.buffer += input;
        let isStartOfToken = true;
        const tokens = [];
        while (this.position < this.buffer.length) {
            const char = this.buffer[this.position];
            switch (this.state) {
                case TokenizerState.TEXT:
                    if (isStartOfToken && (char === '\n' || char === ' ')) {
                        this.position++;
                        isStartOfToken = false;
                    }
                    else if (char === '#') {
                        if (this.position > 0)
                            tokens.push(this.createToken(token_1.TokenType.TEXT));
                        this.state = TokenizerState.HEADER;
                        isStartOfToken = true;
                    }
                    else if (char === '`' && this.peek(2) === '``') {
                        if (this.position > 0)
                            tokens.push(this.createToken(token_1.TokenType.TEXT));
                        this.state = TokenizerState.CODE_BLOCK;
                        this.position += 2;
                        isStartOfToken = true;
                    }
                    else if (char === '*' || char === '_') {
                        if (this.position > 0)
                            tokens.push(this.createToken(token_1.TokenType.TEXT));
                        this.state = TokenizerState.EMPHASIS;
                        isStartOfToken = true;
                    }
                    else {
                        // UNKNOWN.
                        this.position++;
                        isStartOfToken = false;
                    }
                    break;
                case TokenizerState.HEADER:
                    // When in header state, continue till you reach the end of the new line or end of the buffer.
                    if (char === '\n' || this.position === this.buffer.length - 1) {
                        // this.position++; // Increment position to consume the newline.
                        tokens.push(this.createToken(token_1.TokenType.HEADER));
                        this.state = TokenizerState.TEXT;
                        isStartOfToken = true; // Reset isStartOfToken when transitioning back to TEXT.
                    }
                    else {
                        this.position++;
                    }
                    break;
                case TokenizerState.CODE_BLOCK:
                    // When in code block state, continue till you reach the next '```'.
                    if (char === '`' && this.peek(2) === '``') {
                        this.position += 3;
                        tokens.push(this.createToken(token_1.TokenType.CODE_BLOCK));
                        this.state = TokenizerState.TEXT;
                        isStartOfToken = true;
                    }
                    else {
                        this.position++;
                    }
                    break;
                case TokenizerState.EMPHASIS:
                    // This emphasisChar can be either "*" or "_"
                    const emphasisChar = this.buffer[this.position - 1];
                    if (char === emphasisChar || this.position === this.buffer.length - 1) {
                        this.position++;
                        tokens.push(this.createToken(token_1.TokenType.EMPHASIS));
                        this.state = TokenizerState.TEXT;
                        isStartOfToken = true;
                    }
                    else {
                        this.position++;
                    }
                    break;
            }
        }
        if (isEnd && this.position > 0) {
            tokens.push(this.createToken(this.state === TokenizerState.TEXT ? token_1.TokenType.TEXT : token_1.TokenType.UNKNOWN));
        }
        return tokens;
    }
    /**
     * Function: getRemainingBuffer
     *
     * This is a helper function to update the current buffer to the new (shortened) buffer.
     *
     * @returns string
     */
    getRemainingBuffer() {
        return this.buffer.slice(this.position);
    }
    /**
     * Function: peek
     *
     * This is a standard function in any tokenizer to look few characters ahead to
     * know the string.
     *
     * @param n
     * @returns string
     */
    peek(n = 1) {
        return this.buffer.slice(this.position, this.position + n);
    }
    /**
     *
     * Function: createToken
     *
     * @param type : TokenType
     *
     * This function creates a Token. The interface of Token needs two datatype.
     *
     * 1. Token type : This is passed as a function input parameter.
     * 2. Content of the Token : This can be obtained from the buffer and the position we have consumed.
     *
     * Returns: Token.
     *
     * @since 0.0.1
     */
    createToken(type) {
        let content = this.buffer.slice(0, this.position);
        if (type === token_1.TokenType.HEADER) {
            content = content.trim();
        }
        const token = {
            type,
            content: content
        };
        // Update the buffer to contain only the remaining content after the current position.
        this.buffer = this.buffer.slice(this.position);
        // Reset the position to the start of the new(shortened post processing) buffer.
        this.position = 0;
        return token;
    }
}
exports.Tokenizer = Tokenizer;
