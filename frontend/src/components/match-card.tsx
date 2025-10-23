"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PredictionForm } from "@/components/prediction-form";
import { OddsDisplay } from "@/components/odds-display";
import { usePredictions } from "@/components/predictions-provider";
import type { Match } from "@/data/matches";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { predictions } = usePredictions();
  const prediction = predictions[match.id];

  const homeTeamCode = match.home_team_name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  const awayTeamCode = match.away_team_name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const sportColors: Record<string, string> = {
    Basketball: "bg-orange-500 text-white",
    Football: "bg-green-600 text-white",
    Soccer: "bg-blue-600 text-white",
    Baseball: "bg-red-600 text-white",
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Badge
              className={
                sportColors[match.sport_name] ||
                "bg-primary text-primary-foreground"
              }
            >
              {match.sport_name}
            </Badge>
            <div className="flex gap-2">
              {prediction && (
                <Badge
                  variant="outline"
                  className="text-xs border-green-500/50 text-green-600 dark:text-green-400"
                >
                  Predicted
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {match.status}
              </Badge>
            </div>
          </div>

          <div className="mb-4">
            {match.match_date ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">
                  {format(new Date(match.match_date), "MMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(match.match_date), "h:mm a")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mb-1">Date TBD</p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                style={{
                  backgroundColor: `hsl(${
                    homeTeamCode.charCodeAt(0) * 10
                  }, 65%, 55%)`,
                }}
              >
                {homeTeamCode}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-lg truncate">
                  {match.home_team_name}
                </p>
                {match.status === "completed" && (
                  <p className="text-sm text-muted-foreground">
                    Score: {match.home_score}
                  </p>
                )}
                {prediction && (
                  <OddsDisplay
                    probability={prediction.teamA}
                    className="mt-1"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="bg-muted rounded-full px-4 py-1">
                <span className="text-muted-foreground font-medium text-sm">
                  vs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                style={{
                  backgroundColor: `hsl(${
                    awayTeamCode.charCodeAt(0) * 10
                  }, 65%, 55%)`,
                }}
              >
                {awayTeamCode}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-lg truncate">
                  {match.away_team_name}
                </p>
                {match.status === "completed" && (
                  <p className="text-sm text-muted-foreground">
                    Score: {match.away_score}
                  </p>
                )}
                {prediction && (
                  <OddsDisplay
                    probability={prediction.teamB}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full"
            variant={prediction ? "outline" : "default"}
          >
            {prediction ? "Edit Prediction" : "Make Prediction"}
          </Button>
        </CardContent>
      </Card>

      <PredictionForm
        match={match}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </>
  );
}
