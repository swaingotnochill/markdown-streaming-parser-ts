# markdown-streaming-parser-ts (in development)

This is a npm package that can be used to stream tokens and render markdown efficiently.

This is a nascent project and not ready to be used in development yet. Wait for the first minor release (0.1.0) to be able to import and use it.

## DESIGN

- [] Using Node.js built-in Transform stream for efficient processing of large files.
- [] Chunking the input stream to minimize memory usage.
- [] Fast tokenizer that processes the input stream character by character.
- [] State machine approach for efficient token recognition.
- [] Recursive descent parser that process the tokens to generate AST.
- [] Single pass approach to minimize the processing time.
- [] AST walker that converts parsed markdown to HTML.
- [] String builder for efficient HTML generation. - [] Lookup tables for common markdown patterns to minimize processing time.
- [] Character level parsing instead of regex for performance.
- [] Minimize object creations and garbage collection pauses by using primitive values and avoiding extra abstractions.

## BASE GUIDELINES FOR DEVELOPMENT

- [] Compile to both CommonJS and ES modules for max compatibility.
- [] Using native JS/TS features.
- [] No external dependencies.
- [] Bundling like rollup.
- [] UMD and ES module builds.
- [] Benchmark and measure parser.
- [] Compare against other popular markdown-to-html parsers.

## USAGE EXAMPLES

- [] Simple ChatGPT LLM streaming markdown and rendering on html.

Author:
Roshan Swain
Email: swainroshan@gmail.com
Github: https://github.com/swaingotnochill
Twitter: https://twitter.com/@pucchkaa
