/**
 * Fuzzy Search Utility
 * Provides resilient text searching that handles:
 * - Accented characters (café -> cafe)
 * - Small typos (estacionamneto -> estacionamento)
 * - Letter swaps (wfii -> wifi)
 * - Similar variations
 */

/**
 * Normalizes text by removing accents and converting to lowercase
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
    .replace(/[^a-z0-9\s]/g, ''); // Keep only alphanumeric and spaces
}

/**
 * Calculates Levenshtein distance between two strings
 * Returns the minimum number of single-character edits needed
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Calculates similarity ratio between two strings (0 to 1)
 * 1 = identical, 0 = completely different
 */
export function similarityRatio(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

/**
 * Checks if query matches text using fuzzy matching
 * Returns a score from 0 to 1 (higher = better match)
 */
export function fuzzyMatch(query: string, text: string): number {
  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);

  // Exact match after normalization
  if (normalizedText.includes(normalizedQuery)) {
    return 1;
  }

  // Check each word in text against query
  const textWords = normalizedText.split(/\s+/);
  const queryWords = normalizedQuery.split(/\s+/);

  let maxScore = 0;

  for (const queryWord of queryWords) {
    if (queryWord.length < 2) continue; // Skip very short words

    // Check if any text word starts with query word
    for (const textWord of textWords) {
      if (textWord.startsWith(queryWord)) {
        maxScore = Math.max(maxScore, 0.9);
      }
    }

    // Check similarity with each word
    for (const textWord of textWords) {
      const similarity = similarityRatio(queryWord, textWord);

      // Allow more tolerance for longer words
      const threshold = queryWord.length <= 3 ? 0.6 : 0.7;

      if (similarity >= threshold) {
        maxScore = Math.max(maxScore, similarity);
      }
    }
  }

  // Also check overall similarity for single-word queries
  if (queryWords.length === 1 && normalizedQuery.length >= 3) {
    const overallSimilarity = similarityRatio(normalizedQuery, normalizedText);
    if (overallSimilarity >= 0.5) {
      maxScore = Math.max(maxScore, overallSimilarity * 0.8);
    }
  }

  return maxScore;
}

/**
 * Checks if an item matches the search query with fuzzy matching
 * Searches in name and optionally description
 */
export function fuzzySearchMatch(
  query: string,
  name: string,
  description?: string | null
): { matches: boolean; score: number } {
  const nameScore = fuzzyMatch(query, name);
  const descScore = description ? fuzzyMatch(query, description) * 0.8 : 0; // Description matches weighted less

  const maxScore = Math.max(nameScore, descScore);

  // Minimum score threshold for a match
  const threshold = 0.6;

  return {
    matches: maxScore >= threshold,
    score: maxScore,
  };
}
