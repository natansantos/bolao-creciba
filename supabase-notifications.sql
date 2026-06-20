-- ================================================================
-- PALPITEIROS — Migração: Web Push Notifications
-- Execute no SQL Editor do Supabase
-- ================================================================

-- 1. Preferências de notificação no perfil do usuário
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS notify_deadline      BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_result        BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS notify_round_summary BOOLEAN DEFAULT TRUE;

-- 2. Subscriptions de push (uma por dispositivo)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint     TEXT        NOT NULL UNIQUE,
  subscription JSONB       NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuários gerenciam as próprias subscriptions
CREATE POLICY "push_subs_own" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- 3. Log de notificações enviadas (evita duplicatas)
CREATE TABLE IF NOT EXISTS notification_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL,   -- 'deadline_reminder' | 'match_result' | 'round_summary'
  reference_id TEXT        NOT NULL,   -- match_id ou round_id
  sent_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type, reference_id)
);

CREATE INDEX IF NOT EXISTS idx_notif_log_lookup ON notification_log(user_id, type, reference_id);

ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Somente service role acessa (crons usam service role key que bypassa RLS)
CREATE POLICY "notification_log_deny_users" ON notification_log
  FOR ALL USING (false);
