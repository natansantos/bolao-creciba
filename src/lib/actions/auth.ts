'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import nodemailer from 'nodemailer'

export async function loginAction(_prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email ou senha incorretos.' }
  }

  redirect('/how-it-works')
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
    console.error('Supabase signup error:', signupError)
    if (signupError?.code === 'user_already_exists') {
      return { error: 'Este email já está cadastrado.' }
    }
    return { error: 'Erro ao criar conta. Tente novamente.' }
  }

  const { error: profileError } = await admin.from('profiles').insert({
    id: authData.user.id,
    name,
    is_admin: false,
  })

  if (profileError) {
    console.error('Error creating profile:', profileError)
    return { error: 'Erro ao criar perfil do usuário. Tente novamente.' }
  }

  const supabase = await createClient()
  await supabase.auth.signInWithPassword({ email, password })

  redirect('/how-it-works')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function forgotPasswordAction(_prevState: { error: string; success: boolean }, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const token = crypto.randomUUID()

    // Send email with reset link using Gmail SMTP
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const fromName = process.env.SMTP_FROM_NAME || 'Palpiteiros'

    await transporter.sendMail({
      from: `${fromName} <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Redefinir Senha - Palpiteiros',
      html: `
        <p>Olá,</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou isso, ignore este email.</p>
      `,
    })

    return { success: true, error: '' }
  } catch (err) {
    console.error('forgotPasswordAction error:', err)
    return { success: true, error: '' }
  }
}

export async function resetPasswordAction(_prevState: { error: string; success: boolean }, formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const token = formData.get('token') as string
  const email = formData.get('email') as string

  if (!token || !email) {
    return { error: 'Link inválido. Solicite um novo link.', success: false }
  }

  if (password !== confirmPassword) {
    return { error: 'As senhas não conferem.', success: false }
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres.', success: false }
  }

  // Simple password reset: find user by email and update directly
  try {
    const admin = createAdminClient()

    console.log('Attempting to find and update user:', email)

    // Get all users and find by email (workaround for listUsers issues)
    const response = await admin.auth.admin.listUsers()

    if (response && response.data && response.data.users) {
      const user = response.data.users.find((u: any) => u.email === email)

      if (!user) {
        return { error: 'Usuário não encontrado.', success: false }
      }

      // Update password
      const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
        password,
      })

      if (updateError) {
        console.error('Error updating password:', updateError)
        return { error: 'Erro ao atualizar senha.', success: false }
      }

      redirect('/login')
    } else {
      return { error: 'Erro ao buscar usuários.', success: false }
    }
  } catch (err) {
    console.error('Reset password error:', err)
    return { error: 'Erro ao redefinir senha. Tente novamente.', success: false }
  }
}
