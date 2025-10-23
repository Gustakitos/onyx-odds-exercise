/**
 * Calculate implied decimal odds from probability
 * Formula: odds = 1 / (probability / 100)
 * @param probability - Win probability as a percentage (0-100)
 * @returns Formatted odds string (e.g., "1.72") or "—" if probability is 0
 */
export function calculateImpliedOdds(probability: number): string {
  if (probability === 0) {
    return "—"
  }

  const odds = 1 / (probability / 100)
  return odds.toFixed(2)
}

/**
 * Format probability as a percentage string
 * @param probability - Probability value (0-100)
 * @returns Formatted percentage (e.g., "58%")
 */
export function formatProbability(probability: number): string {
  return `${probability.toFixed(0)}%`
}
