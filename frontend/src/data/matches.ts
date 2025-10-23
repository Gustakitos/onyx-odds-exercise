export interface Match {
  id: number;
  sport_id: number;
  sport_name: string;
  home_team_id: number;
  home_team_name: string;
  away_team_id: number;
  away_team_name: string;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  created_at: string;
}
