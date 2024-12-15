/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/


/**
 * Interface: Token.
 * 
 * Represents a token in the markdown document.
 * This interface defines the structure of a token, which is a fundamental unit in the parsing process of markdown text.
 * 
 * Properties:
 * - type: Indicates the category of the token (e.g., TEXT, HEADER, CODE_BLOCK).
 * - content: The actual text content of the token.
 * 
 * Usage:
 * Tokens are created during the tokenization phase of parsing and are later
 * used to construct the Abstract Syntax Tree (AST) of the markdown document.
 * 
 * @since 0.0.1
 * @see TokenType
 */

export interface Token {
	type: TokenType;
	content: string;
}

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

export enum TokenType {
	TEXT,
	HEADER,
	CODE_BLOCK,
	EMPHASIS,
	UNKNOWN
}
