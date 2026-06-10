export interface Profile {
  id: string
  name: string
  is_admin: boolean
  created_at: string
}

export interface InviteLink {
  id: string
  token: string
  created_by: string | null
  expires_at: string
  used: boolean
  used_by: string | null
  created_at: string
}

export type RoundPhase =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarterfinal'
  | 'semifinal'
  | 'third_place'
  | 'final'

export type RoundStatus = 'locked' | 'open' | 'finished'

export interface Round {
  id: string
  name: string
  phase: RoundPhase
  status: RoundStatus
  created_at: string
}

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface Match {
  id: string
  round_id: string
  home_team: string
  away_team: string
  home_flag: string | null
  away_flag: string | null
  match_time: string
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  is_knockout: boolean
  went_to_penalties: boolean
  penalty_winner: 'home' | 'away' | null
  api_fixture_id: number | null
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  home_score_pred: number
  away_score_pred: number
  penalty_winner_pred: 'home' | 'away' | null
  points: number | null
  created_at: string
  updated_at: string
}

export interface RankingEntry {
  id: string
  name: string
  total_points: number
  exact_scores: number
  correct_results: number
}

export interface MatchWithPrediction extends Match {
  prediction?: Prediction | null
  round?: Round
}
