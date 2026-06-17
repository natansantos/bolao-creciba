'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateNotificationPrefsAction(
  _prevState: { error: string | null },
  formData: FormData
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').update({
    notify_deadline:      formData.get('notify_deadline')      === 'on',
    notify_result:        formData.get('notify_result')        === 'on',
    notify_round_summary: formData.get('notify_round_summary') === 'on',
  }).eq('id', user.id)

  if (error) return { error: 'Erro ao salvar preferências' }

  revalidatePath('/settings')
  return { error: null }
}
