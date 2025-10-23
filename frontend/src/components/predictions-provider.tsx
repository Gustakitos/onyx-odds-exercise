"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { loadPredictions, savePredictionsToStorage } from "@/lib/storage"

export interface Prediction {
  teamA: number
  teamB: number
}

interface PredictionsContextType {
  predictions: Record<string, Prediction>
  savePrediction: (matchId: string, prediction: Prediction) => void
  clearPrediction: (matchId: string) => void
}

const PredictionsContext = createContext<PredictionsContextType | undefined>(undefined)

export function PredictionsProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loaded = loadPredictions()
    setPredictions(loaded)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      savePredictionsToStorage(predictions)
    }
  }, [predictions, isLoaded])

  const savePrediction = (matchId: string, prediction: Prediction) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: prediction,
    }))
  }

  const clearPrediction = (matchId: string) => {
    setPredictions((prev) => {
      const newPredictions = { ...prev }
      delete newPredictions[matchId]
      return newPredictions
    })
  }

  return (
    <PredictionsContext.Provider value={{ predictions, savePrediction, clearPrediction }}>
      {children}
    </PredictionsContext.Provider>
  )
}

export function usePredictions() {
  const context = useContext(PredictionsContext)
  if (!context) {
    throw new Error("usePredictions must be used within PredictionsProvider")
  }
  return context
}
