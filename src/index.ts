import { Transform, TransformCallback } from "stream";

class MarkdownStreamParser extends Transform {
	private buffer: string;

	constructor(options?: any) {
		super(options);
		this.buffer = "";
	}

	_transform(
		chunk: string,
		encoding: BufferEncoding,
		callback: TransformCallback,
	): void {
		this.buffer += chunk.toString();

		// TODO: Main parser implementation.

		callback();
	}

	_flush(callback: TransformCallback): void {
		// TODO: Handle remaining data in the buffer.

		callback();
	}
}

export = MarkdownStreamParser;
