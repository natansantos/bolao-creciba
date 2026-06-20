import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush, type PushSubscriptionJSON } from '@/lib/push'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const admin = createAdminClient()
  const now = new Date()

  // Deadline = match_time - 30 min. We want deadline ~30 min from now.
  // So match_time is between now+55min and now+65min (10-minute detection window).
  const windowStart = new Date(now.getTime() + 55 * 60 * 1000).toISOString()
  const windowEnd   = new Date(now.getTime() + 65 * 60 * 1000).toISOString()

  const { data: matches } = await admin
    .from('matches')
    .select('id, home_team, away_team, match_time')
    .eq('status', 'upcoming')
    .gte('match_time', windowStart)
    .lte('match_time', windowEnd)

  if (!matches || matches.length === 0) {
    return NextResponse.json({ notified: 0, message: 'Nenhum jogo com deadline iminente' })
  }

  // Users who want deadline notifications
  const { data: users } = await admin
    .from('profiles')
    .select('id, name')
    .eq('notify_deadline', true)

  if (!users || users.length === 0) {
    return NextResponse.json({ notified: 0, message: 'Nenhum usuário com deadline ativo' })
  }

  let notified = 0
  const log: string[] = []

  for (const match of matches) {
    // Who already has a prediction for this match
    const { data: existing } = await admin
      .from('predictions')
      .select('user_id')
      .eq('match_id', match.id)

    const alreadyPredicted = new Set((existing ?? []).map(p => p.user_id))

    for (const user of users) {
      if (alreadyPredicted.has(user.id)) continue

      // Avoid duplicate notification
      const { data: already } = await admin
        .from('notification_log')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'deadline_reminder')
        .eq('reference_id', match.id)
        .maybeSingle()

      if (already) continue

      // Get push subscriptions for this user
      const { data: subs } = await admin
        .from('push_subscriptions')
        .select('subscription, endpoint')
        .eq('user_id', user.id)

      let sent = false
      for (const row of subs ?? []) {
        const ok = await sendPush(row.subscription as PushSubscriptionJSON, {
          title: '⏰ Prazo encerrando em 30 min!',
          body: `${match.home_team} × ${match.away_team} — faça seu palpite antes que feche!`,
          url: '/predictions',
          tag: `deadline-${match.id}`,
        })
        if (!ok) {
          // Subscription expired — clean up
          await admin.from('push_subscriptions').delete().eq('endpoint', row.endpoint)
        } else {
          sent = true
        }
      }

      if (sent) {
        await admin.from('notification_log').insert({
          user_id: user.id,
          type: 'deadline_reminder',
          reference_id: match.id,
        })
        notified++
        log.push(`${user.name} ← ${match.home_team} × ${match.away_team}`)
      }
    }
  }

  return NextResponse.json({ notified, log })
}
