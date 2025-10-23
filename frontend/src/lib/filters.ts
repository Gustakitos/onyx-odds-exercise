import type { Match } from "@/data/matches"
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isWithinInterval,
  isSameDay,
  parseISO,
  isValid
} from "date-fns"

interface FilterOptions {
  sport: string
  dateRange: string
  search: string
}

function getCurrentWeekBounds(): { weekStart: Date; weekEnd: Date } {
  const now = new Date()

  const weekStart = startOfDay(startOfWeek(now, { weekStartsOn: 1 }))
  const weekEnd = endOfDay(endOfWeek(now, { weekStartsOn: 1 }))

  return { weekStart, weekEnd }
}

export function filterMatches(matches: Match[], options: FilterOptions): Match[] {
  const { sport, dateRange, search } = options
  const now = new Date()
  const today = startOfDay(now)
  const { weekStart, weekEnd } = getCurrentWeekBounds()

  return matches
    .filter((match) => {
      if (sport !== "all" && match.sport_name !== sport) {
        return false
      }

      if (match.match_date) {
        let matchDate: Date
        try {
          matchDate = typeof match.match_date === 'string' ? parseISO(match.match_date) : new Date(match.match_date)

          if (!isValid(matchDate)) {
            console.warn('Invalid match date:', match.match_date)
            return false
          }
        } catch (error) {
          console.warn('Error parsing match date:', match.match_date, error)
          return false
        }

        if (dateRange === "today") {
          if (!isSameDay(matchDate, today)) {
            return false
          }
        } else if (dateRange === "week") {
          if (!isWithinInterval(matchDate, { start: weekStart, end: weekEnd })) {
            return false
          }
        }
      }

      if (search) {
        const searchLower = search.toLowerCase()
        const homeTeamMatch = match.home_team_name.toLowerCase().includes(searchLower)
        const awayTeamMatch = match.away_team_name.toLowerCase().includes(searchLower)
        if (!homeTeamMatch && !awayTeamMatch) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      if (!a.match_date && !b.match_date) return 0
      if (!a.match_date) return 1
      if (!b.match_date) return -1

      try {
        const dateA = typeof a.match_date === 'string' ? parseISO(a.match_date) : new Date(a.match_date)
        const dateB = typeof b.match_date === 'string' ? parseISO(b.match_date) : new Date(b.match_date)

        if (!isValid(dateA) || !isValid(dateB)) {
          return 0
        }

        return dateA.getTime() - dateB.getTime()
      } catch (error) {
        console.log('Error sorting by date:', error)
        return 0
      }
    })
}
