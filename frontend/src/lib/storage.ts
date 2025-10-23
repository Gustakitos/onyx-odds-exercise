import type { Prediction } from "@/components/predictions-provider"

const STORAGE_KEY = "sportpredict-predictions"

/**
 * Load predictions from localStorage
 * Safe for SSR - returns empty object if localStorage is unavailable
 */
export function loadPredictions(): Record<string, Prediction> {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return {}
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error("Failed to load predictions from localStorage:", error)
    return {}
  }
}

/**
 * Save predictions to localStorage
 * Safe for SSR - does nothing if localStorage is unavailable
 */
export function savePredictionsToStorage(predictions: Record<string, Prediction>): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions))
  } catch (error) {
    console.error("Failed to save predictions to localStorage:", error)
  }
}
