"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { OddsDisplay } from "@/components/odds-display";
import { usePredictions } from "@/components/predictions-provider";
import type { Match } from "@/data/matches";

interface PredictionFormProps {
  match: Match;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PredictionForm({
  match,
  open,
  onOpenChange,
}: PredictionFormProps) {
  const { predictions, savePrediction, clearPrediction } = usePredictions();
  const existingPrediction = predictions[match.id.toString()];

  const [teamAProb, setTeamAProb] = useState<number>(
    existingPrediction?.teamA ?? 50
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setTeamAProb(existingPrediction?.teamA ?? 50);
      setError("");
    }
  }, [open, existingPrediction]);

  const teamBProb = 100 - teamAProb;

  const handleTeamAChange = (value: string) => {
    const num = Number.parseFloat(value);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      return;
    }
    if (num < 0 || num > 100) {
      setError("Probability must be between 0 and 100");
      return;
    }
    setError("");
    setTeamAProb(num);
  };

  const handleSliderChange = (values: number[]) => {
    setTeamAProb(values[0]);
    setError("");
  };

  const handleSave = async () => {
    if (teamAProb < 0 || teamAProb > 100) {
      setError("Probability must be between 0 and 100");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      savePrediction(match.id.toString(), {
        teamA: teamAProb,
        teamB: teamBProb,
      });
      onOpenChange(false);
    } catch {
      setError("Failed to save prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearPrediction(match.id.toString());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto backdrop-blur-md border-2 border-border/50 dark:border-border/30 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 rounded-xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/20">
          <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
            Make Your Prediction
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Predict the outcome for {match.away_team_name} vs{" "}
            {match.home_team_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="teamA-prob"
                className="text-sm font-semibold text-foreground"
              >
                {match.home_team_name} Win Probability (%)
              </Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Input
                  id="teamA-prob"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={teamAProb}
                  onChange={(e) => handleTeamAChange(e.target.value)}
                  className="w-full sm:w-24 font-mono font-semibold text-center border-2 focus:border-primary"
                  aria-describedby={error ? "prob-error" : undefined}
                />
                <div className="flex-1 w-full space-y-3">
                  <Slider
                    value={[teamAProb]}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={1}
                    aria-label={`${match.home_team_name} win probability`}
                    className="py-2"
                  />
                  <div className="flex justify-between text-sm font-medium px-1">
                    <span className="text-muted-foreground">0%</span>
                    <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {teamAProb.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 dark:bg-destructive/20 border-2 border-destructive/30 dark:border-destructive/40 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-destructive/20 dark:bg-destructive/30 flex items-center justify-center mt-0.5">
                      <span className="text-destructive text-sm font-bold">
                        !
                      </span>
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm text-destructive font-medium leading-relaxed"
                        role="alert"
                      >
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="teamB-prob"
                className="text-sm font-semibold text-foreground"
              >
                {match.away_team_name} Win Probability (%)
              </Label>
              <Input
                id="teamB-prob"
                type="number"
                value={teamBProb.toFixed(1)}
                readOnly
                disabled
                className="w-24 font-mono font-semibold text-center opacity-75 bg-muted/50"
              />
              <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
                💡 Automatically calculated as 100 - {match.home_team_name}{" "}
                probability
              </p>
            </div>
          </div>

          <div className="border-t-2 border-border pt-6">
            <h4 className="text-base font-bold mb-4 text-foreground">
              Implied Decimal Odds
            </h4>
            <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {match.home_team_name}
                </span>
                <OddsDisplay
                  probability={teamAProb}
                  className="font-semibold"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {match.away_team_name}
                </span>
                <OddsDisplay
                  probability={teamBProb}
                  className="font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 border-t border-border">
          {existingPrediction && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="w-full sm:w-auto sm:mr-auto bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
            >
              🗑️ Clear
            </Button>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto hover:bg-muted/50 transition-all disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!!error || isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>💾 Save Prediction</>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
