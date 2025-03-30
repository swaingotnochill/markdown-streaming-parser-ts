/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { ASTNode, NodeType } from "./parser";

// Intermediate renderable state that's optimized for HTML generation
export interface RenderNode {
  tag: string;
  attributes?: Record<string, string>;
  content?: string;
  children?: RenderNode[];
  selfClosing?: boolean;
}

export class Transformer {
  private static readonly TAG_MAP: Record<NodeType, string> = {
    [NodeType.DOCUMENT]: "div",
    [NodeType.PARAGRAPH]: "p",
    [NodeType.TEXT]: "span",
    [NodeType.HEADER]: "h1", // Base header tag, level will be determined dynamically
    [NodeType.CODE_BLOCK]: "pre",
    [NodeType.EMPHASIS]: "em",
    [NodeType.LINEBREAK]: "br"
  };

  // Transform AST to intermediate renderable state
  transform(ast: ASTNode): RenderNode {
    return this.transformNode(ast);
  }

  private transformNode(node: ASTNode): RenderNode {
    const renderNode: RenderNode = {
      tag: Transformer.TAG_MAP[node.type]
    };

    // Handle special cases and attributes
    switch (node.type) {
      case NodeType.DOCUMENT:
        renderNode.attributes = { class: "markdown-content" };
        break;

      case NodeType.HEADER:
        renderNode.tag = `h${node.metadata?.level || 1}`;
        break;

      case NodeType.CODE_BLOCK:
        renderNode.tag = "pre";
        renderNode.children = [{
          tag: "code",
          attributes: node.metadata?.language ? 
            { class: `language-${node.metadata.language}` } : undefined,
          content: node.value
        }];
        return renderNode;

      case NodeType.LINEBREAK:
        renderNode.selfClosing = true;
        return renderNode;

      case NodeType.TEXT:
        if (node.value !== undefined) {
          renderNode.content = node.value;
          return renderNode;
        }
        break;
    }

    // Transform children if they exist
    if (node.children && node.children.length > 0) {
      renderNode.children = node.children.map(child => this.transformNode(child));
    }

    return renderNode;
  }
}
