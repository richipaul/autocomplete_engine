export interface EditOperation {
  type: 'INSERT' | 'DELETE' | 'REPLACE' | 'MATCH';
  char?: string;
  sourceIndex: number;
  targetIndex: number;
}

export interface EditDistanceResult {
  distance: number;
  matrix: number[][];
  operations: EditOperation[];
}

export function levenshteinDistance(source: string, target: string): EditDistanceResult {
  const m = source.length;
  const n = target.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (source[i - 1] === target[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // Delete
          dp[i][j - 1] + 1,    // Insert
          dp[i - 1][j - 1] + 1 // Replace
        );
      }
    }
  }

  const operations: EditOperation[] = [];
  let i = m, j = n;
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && source[i - 1] === target[j - 1]) {
      operations.push({ type: 'MATCH', sourceIndex: i - 1, targetIndex: j - 1 });
      i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.push({ type: 'REPLACE', char: target[j - 1], sourceIndex: i - 1, targetIndex: j - 1 });
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      operations.push({ type: 'INSERT', char: target[j - 1], sourceIndex: i, targetIndex: j - 1 });
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.push({ type: 'DELETE', char: source[i - 1], sourceIndex: i - 1, targetIndex: j });
      i--;
    }
  }

  operations.reverse();
  
  return {
    distance: dp[m][n],
    matrix: dp,
    operations
  };
}
