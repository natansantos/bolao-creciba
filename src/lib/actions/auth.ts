'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function loginAction(_prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email ou senha incorretos.' }
  }

  redirect('/dashboard')
}

export async function registerAction(_prevState: { error: string }, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const admin = createAdminClient()

  const { data: authData, error: signupError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (signupError || !authData.user) {
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }

  await admin.from('profiles').insert({
    id: authData.user.id,
    name,
    is_admin: false,
  })

  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email, password })

  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
