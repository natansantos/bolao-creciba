'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { isPredictionAllowed } from '@/lib/deadline'

export async function savePredictionAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado' }

  const matchId = formData.get('match_id') as string
  const homeScore = parseInt(formData.get('home_score_pred') as string)
  const awayScore = parseInt(formData.get('away_score_pred') as string)
  const penaltyWinner = formData.get('penalty_winner_pred') as 'home' | 'away' | null

  if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
    return { error: 'Placar inválido' }
  }

  const { data: match } = await supabase
    .from('matches')
    .select('match_time, is_knockout')
    .eq('id', matchId)
    .single()

  if (!match) return { error: 'Jogo não encontrado' }

  if (!isPredictionAllowed(match.match_time)) {
    return { error: 'Deadline encerrado. Palpites não são mais permitidos.' }
  }

  const payload = {
    user_id: user.id,
    match_id: matchId,
    home_score_pred: homeScore,
    away_score_pred: awayScore,
    penalty_winner_pred: match.is_knockout && homeScore === awayScore ? (penaltyWinner || null) : null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('predictions')
    .upsert(payload, { onConflict: 'user_id,match_id' })

  if (error) return { error: 'Erro ao salvar palpite' }

  revalidatePath('/dashboard')
  return { error: null }
}
