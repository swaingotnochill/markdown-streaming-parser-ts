# markdown-streaming-parser-ts (in development)

This is a npm package that can be used to stream tokens and render markdown efficiently.

This is a nascent project and not ready to be used in development yet. Wait for the first minor release (0.1.0) to be able to import and use it.

## DESIGN

- [x] Using Node.js built-in Transform stream for efficient processing of large files.
- [x] Chunking the input stream to minimize memory usage.
- [x] Fast tokenizer that processes the input stream character by character.
- [x] State machine approach for efficient token recognition.
- [x] Recursive descent parser that process the tokens to generate AST.
- [] Single pass approach to minimize the processing time.
- [] Add all configuration options that allows the users to redner the html accordingly.
- [] AST walker that converts parsed markdown to HTML.
- [] String builder for efficient HTML generation.
- [] Lookup tables for common markdown patterns to minimize processing time.
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

## STATE MACHINE

A state machine is a model of computation based on a hypothetical machine that has finite number of states at any instance of time. For markdown parsing, each state represent as different context in the markdown document ( eg., normal text, inside a header, inside a code block, etc. ). The state machine transitions from one state to another based on the input character.

Key characteristics of state machine:

1. States: Different states in the markdown document. (eg. TEXT, HEADER, CODE, LIST, QUOTE, ETC.)
2. Transitions: Rules for moviing between states based on the input.
3. Actions: Operations performed when entering, exiting or within a state.

## USAGE

```TS
import { MarkdownStreamParser } from "markdown-streaming-parser-ts";
import {Readable} from "stream";

const input = '# Hello\nWorld!\n`code`\n*emphasis*';
const readable = new Readable();
readable._read = () => {};
readable.push(input);
readable.push(null);
const parser = new MarkdownStreamParser();

readable.pipe(parser)
.on('data', (chunk) => {
    console.log(JSON.parse(chunk));
})
.on('end', () => {
    console.log('Parsing complete');
})
```

## USAGE EXAMPLES

- [] Simple ChatGPT LLM streaming markdown and rendering on html.

Author:
Roshan Swain
Email: swainroshan@gmail.com
Github: https://github.com/swaingotnochill
Twitter: https://twitter.com/@pucchkaa
