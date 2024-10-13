"use strict";
/**
Author: Roshan Swain
Email: swainroshan@gmail.com
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
/**
 * Enum: TokenType.
 *
 * Enumerates the different types of tokens that can be encountered during markdown parsing.
 *
 * Values:
 * - TEXT: Represents plain text content.
 * - HEADER: Indicates a header element (e.g., #, ##, ###).
 * - CODE_BLOCK: Denotes a block of code, typically enclosed in backticks or indented.
 * - EMPHASIS: Represents emphasized text (e.g., *italic*, **bold**).
 * - UNKNOWN: Used for tokens that don't match any known markdown element.
 *
 * Usage:
 * These token types are assigned to Token objects during the tokenization process,
 * allowing the parser to understand and process different markdown elements appropriately.
 *
 * @since 0.0.1
 * @see Token
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["TEXT"] = 0] = "TEXT";
    TokenType[TokenType["HEADER"] = 1] = "HEADER";
    TokenType[TokenType["CODE_BLOCK"] = 2] = "CODE_BLOCK";
    TokenType[TokenType["EMPHASIS"] = 3] = "EMPHASIS";
    TokenType[TokenType["UNKNOWN"] = 4] = "UNKNOWN";
})(TokenType || (exports.TokenType = TokenType = {}));
