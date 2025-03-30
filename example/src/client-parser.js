// This module directly imports and uses the MarkdownStreamingParser
// with no fallback implementation

import { MarkdownStreamingParser } from 'markdown-streaming-parser';

/**
 * Creates a markdown parser instance using only the real implementation
 * This demonstrates the performance and correctness of our parser
 */
export function createMarkdownParser() {
  try {
    console.log('Creating instance of the real MarkdownStreamingParser');
    return new MarkdownStreamingParser();
  } catch (error) {
    console.error('Failed to create MarkdownStreamingParser instance:', error);
    // Even in error case, we don't want a fallback - just throw the error
    throw new Error('Could not initialize the MarkdownStreamingParser. Please ensure the package is properly built and installed.');
  }
}
