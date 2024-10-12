export interface Token {
	type: TokenType;
	content: string;
	level?: number;
}
export enum TokenType {
	Text,
	Header,
	Paragraph,
	Bold,
	Italic,
	Link,
	Image,
	Code,
	BlockQuote,
	ListItem,
}
