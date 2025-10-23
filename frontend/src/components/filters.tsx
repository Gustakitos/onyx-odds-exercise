"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersProps {
  sport: string
  dateRange: string
  search: string
  onSportChange: (value: string) => void
  onDateRangeChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export function Filters({
  sport,
  dateRange,
  search,
  onSportChange,
  onDateRangeChange,
  onSearchChange,
}: FiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="sport-select" className="sr-only">
            Select sport
          </label>
          <Select value={sport} onValueChange={onSportChange}>
            <SelectTrigger id="sport-select" className="w-full">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Soccer">Soccer</SelectItem>
              <SelectItem value="Baseball">Baseball</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label htmlFor="date-range-select" className="sr-only">
            Select date range
          </label>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger id="date-range-select" className="w-full">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search teams
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
