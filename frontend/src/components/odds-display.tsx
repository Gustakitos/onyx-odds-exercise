import { calculateImpliedOdds } from "@/lib/odds"
import { cn } from "@/lib/utils"

interface OddsDisplayProps {
  probability: number
  className?: string
}

export function OddsDisplay({ probability, className }: OddsDisplayProps) {
  const odds = calculateImpliedOdds(probability)

  return (
    <div className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground font-medium">{probability.toFixed(0)}%</span>
      <span className="px-3 py-1.5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border border-primary/20 font-mono font-bold text-sm shadow-sm">
        {odds}
      </span>
    </div>
  )
}
