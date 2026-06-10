-- ================================================================
-- PALPITEIROS COPA DO MUNDO 2026 — Supabase Setup
-- Execute este arquivo no SQL Editor do Supabase
-- ================================================================

-- Tabelas
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('group','round_of_32','round_of_16','quarterfinal','semifinal','third_place','final')),
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked','open','finished')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_flag TEXT,
  away_flag TEXT,
  match_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','live','finished')),
  home_score INT,
  away_score INT,
  is_knockout BOOLEAN DEFAULT FALSE,
  went_to_penalties BOOLEAN DEFAULT FALSE,
  penalty_winner TEXT CHECK (penalty_winner IN ('home','away')),
  api_fixture_id INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  home_score_pred INT NOT NULL,
  away_score_pred INT NOT NULL,
  penalty_winner_pred TEXT CHECK (penalty_winner_pred IN ('home','away')),
  points INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- Índices
CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_matches_round ON matches(round_id);

-- ================================================================
-- RLS (Row Level Security)
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- profiles: usuário lê/edita apenas o próprio; admin lê todos
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE
  ));
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- predictions: usuário cria/edita os próprios, lê todos
CREATE POLICY "predictions_select_all" ON predictions
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "predictions_insert_own" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "predictions_update_own" ON predictions
  FOR UPDATE USING (auth.uid() = user_id);

-- matches: todos autenticados leem; service role escreve
CREATE POLICY "matches_select_auth" ON matches
  FOR SELECT USING (auth.role() = 'authenticated');

-- rounds: todos autenticados leem; service role escreve
CREATE POLICY "rounds_select_auth" ON rounds
  FOR SELECT USING (auth.role() = 'authenticated');

-- invite_links: apenas service role acessa (sem policies de usuário)

-- ================================================================
-- Função de Ranking
-- ================================================================

CREATE OR REPLACE FUNCTION get_ranking()
RETURNS TABLE (
  id UUID,
  name TEXT,
  total_points BIGINT,
  exact_scores BIGINT,
  correct_results BIGINT
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT
    p.id,
    p.name,
    COALESCE(SUM(pr.points), 0) AS total_points,
    COUNT(pr.points) FILTER (WHERE pr.points = 10) AS exact_scores,
    COUNT(pr.points) FILTER (WHERE pr.points >= 5) AS correct_results
  FROM profiles p
  LEFT JOIN predictions pr ON pr.user_id = p.id
  GROUP BY p.id, p.name
  ORDER BY total_points DESC, exact_scores DESC, correct_results DESC;
$$;
