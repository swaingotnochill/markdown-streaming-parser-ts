import { NodeType } from "../src/parser";
import { HTMLRenderer } from "../src/renderer";
import { Transformer } from "../src/transform";

describe("HTML Generator", () => {
  it("should convert AST to HTML", () => {
    const inputAST = {
      type: NodeType.DOCUMENT,
      children: [
        {
          type: NodeType.HEADER,
          children: [{ type: NodeType.TEXT, value: 'Hello' }],
          metadata: { level: 1 }
        },
        {
          type: NodeType.PARAGRAPH,
          children: [{ type: NodeType.TEXT, value: 'World!' }],
        },
        {
          type: NodeType.CODE_BLOCK,
          value: 'code',
          metadata: { language: null },
        },
        {
          type: NodeType.EMPHASIS,
          children: [{ type: NodeType.TEXT, value: 'emphasis' }]
        }
      ]
    };

    const transformer = new Transformer();
    const renderer = new HTMLRenderer();
    
    const renderTree = transformer.transform(inputAST);
    const html = renderer.render(renderTree);

    expect(html).toBe(
      '<div class="markdown-content">' +
      '<h1><span>Hello</span></h1>' +
      '<p><span>World!</span></p>' +
      '<pre><code>code</code></pre>' +
      '<em><span>emphasis</span></em>' +
      '</div>'
    );
  });

  it("should handle code blocks with language", () => {
    const inputAST = {
      type: NodeType.DOCUMENT,
      children: [
        {
          type: NodeType.CODE_BLOCK,
          value: 'const x = 42;',
          metadata: { language: 'typescript' },
        }
      ]
    };

    const transformer = new Transformer();
    const renderer = new HTMLRenderer();
    
    const renderTree = transformer.transform(inputAST);
    const html = renderer.render(renderTree);

    expect(html).toBe(
      '<div class="markdown-content">' +
      '<pre><code class="language-typescript">const x = 42;</code></pre>' +
      '</div>'
    );
  });
});
