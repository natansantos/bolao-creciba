import { createClient } from '@/lib/supabase/client'

export async function resetPasswordForEmail(email: string) {
  const supabase = createClient()
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
  })
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  return await supabase.auth.updateUser({ password })
}
