interface MatchResult {
  home_score: number
  away_score: number
  went_to_penalties: boolean
  penalty_winner: 'home' | 'away' | null
}

interface PredictionInput {
  home_score_pred: number
  away_score_pred: number
  penalty_winner_pred: 'home' | 'away' | null
}

export function calculatePoints(result: MatchResult, prediction: PredictionInput): number {
  const { home_score, away_score, went_to_penalties, penalty_winner } = result
  const { home_score_pred, away_score_pred, penalty_winner_pred } = prediction

  const exactScore = home_score_pred === home_score && away_score_pred === away_score
  const correctResult =
    (home_score_pred > away_score_pred && home_score > away_score) ||
    (home_score_pred < away_score_pred && home_score < away_score) ||
    (home_score_pred === away_score_pred && home_score === away_score)
  const oneTeamGoals = home_score_pred === home_score || away_score_pred === away_score

  let points = 0
  if (exactScore) points = 10
  else if (correctResult && oneTeamGoals) points = 7
  else if (correctResult) points = 5
  else if (oneTeamGoals) points = 2

  if (went_to_penalties && penalty_winner_pred === penalty_winner) {
    points += 3
  }

  return points
}
