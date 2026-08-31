export class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  frequency: number;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0;
  }
}

export interface TrieSearchResult {
  found: boolean;
  nodesVisited: number;
  depth: number;
}

export interface Suggestion {
  word: string;
  frequency: number;
  score: number;
}

export class Trie {
  root: TrieNode;
  nodeCount: number;

  constructor() {
    this.root = new TrieNode();
    this.nodeCount = 1;
  }

  insert(word: string, frequency: number = 0): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
        this.nodeCount++;
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
    current.frequency = frequency;
  }

  search(word: string): TrieSearchResult {
    let current = this.root;
    let nodesVisited = 1;
    let depth = 0;

    for (const char of word) {
      if (!current.children.has(char)) {
        return { found: false, nodesVisited, depth };
      }
      current = current.children.get(char)!;
      nodesVisited++;
      depth++;
    }

    return { found: current.isEndOfWord, nodesVisited, depth };
  }

  startsWith(prefix: string): { node: TrieNode | null; nodesVisited: number; depth: number } {
    let current = this.root;
    let nodesVisited = 1;
    let depth = 0;

    for (const char of prefix) {
      if (!current.children.has(char)) {
        return { node: null, nodesVisited, depth };
      }
      current = current.children.get(char)!;
      nodesVisited++;
      depth++;
    }

    return { node: current, nodesVisited, depth };
  }

  getSuggestions(prefix: string, maxResults: number = 10): { suggestions: Suggestion[], nodesVisited: number } {
    const { node, nodesVisited } = this.startsWith(prefix);
    let totalVisited = nodesVisited;
    if (!node) return { suggestions: [], nodesVisited: totalVisited };

    const suggestions: Suggestion[] = [];

    const dfs = (currentNode: TrieNode, currentWord: string) => {
      totalVisited++;
      if (currentNode.isEndOfWord) {
        // Simple ranking formula prioritizing exactness and frequency
        const lengthDiff = currentWord.length - prefix.length;
        const score = (currentNode.frequency * 0.5) + (100 / (lengthDiff + 1));
        suggestions.push({ word: currentWord, frequency: currentNode.frequency, score });
      }

      for (const [char, childNode] of currentNode.children.entries()) {
        dfs(childNode, currentWord + char);
      }
    };

    dfs(node, prefix);

    suggestions.sort((a, b) => b.score - a.score);
    return { suggestions: suggestions.slice(0, maxResults), nodesVisited: totalVisited };
  }

  delete(word: string): boolean {
    const dfs = (node: TrieNode, word: string, index: number): boolean => {
      if (index === word.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        return node.children.size === 0;
      }

      const char = word[index];
      const childNode = node.children.get(char);
      if (!childNode) return false;

      const shouldDeleteChild = dfs(childNode, word, index + 1);

      if (shouldDeleteChild) {
        node.children.delete(char);
        this.nodeCount--;
        return node.children.size === 0 && !node.isEndOfWord;
      }
      return false;
    };

    return dfs(this.root, word, 0);
  }
}
