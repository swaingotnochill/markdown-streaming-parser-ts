/** 
Author: Roshan Swain
Email: swainroshan@gmail.com
*/

import { RenderNode } from "./transform";

export class HTMLRenderer {
  // String buffer for efficient string concatenation
  private buffer: string[] = [];

  render(node: RenderNode): string {
    this.buffer = [];
    this.renderNode(node);
    return this.buffer.join("");
  }

  private renderNode(node: RenderNode): void {
    // Opening tag with attributes
    this.buffer.push("<", node.tag);
    
    if (node.attributes) {
      for (const [key, value] of Object.entries(node.attributes)) {
        this.buffer.push(` ${key}="${this.escapeHtml(value)}"`);
      }
    }

    if (node.selfClosing) {
      this.buffer.push(" />");
      return;
    }

    this.buffer.push(">");

    // Content
    if (node.content !== undefined) {
      this.buffer.push(this.escapeHtml(node.content));
    }

    // Children
    if (node.children) {
      for (const child of node.children) {
        this.renderNode(child);
      }
    }

    // Closing tag
    this.buffer.push("</", node.tag, ">");
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
