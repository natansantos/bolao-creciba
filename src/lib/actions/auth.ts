'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import * as jwt from 'jsonwebtoken'

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

export async function forgotPasswordAction(_prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string

  try {
    // Generate JWT token valid for 1 hour (skip existence check to avoid Auth API issues)
    const token = jwt.sign(
      { email, type: 'password_recovery' },
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'secret',
      { expiresIn: '1h' }
    )

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperar Senha - Palpiteiros',
      html: `
        <h2>Recuperar Senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>O link expira em 1 hora.</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { error: '', success: true }
  } catch (err: any) {
    console.error('Forgot password error:', err)
    return { error: 'Erro ao enviar email. Tente novamente.' }
  }
}

export async function resetPasswordAction(_prevState: { error: string; success: boolean }, formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const token = formData.get('token') as string
  const email = formData.get('email') as string

  if (!token || !email) {
    return { error: 'Link inválido ou expirado.', success: false }
  }

  if (password !== confirmPassword) {
    return { error: 'As senhas não conferem.', success: false }
  }

  if (password.length < 6) {
    return { error: 'A senha deve ter pelo menos 6 caracteres.', success: false }
  }

  try {
    // Verify token
    jwt.verify(token, process.env.SUPABASE_SERVICE_ROLE_KEY || 'secret')
    const decoded: any = jwt.decode(token)

    if (decoded?.email !== email) {
      return { error: 'Link inválido.', success: false }
    }

    // Get user ID by email, then update password
    const admin = createAdminClient()
    const { data: userData, error: getUserError } = await admin.auth.admin.getUserByEmail(email)

    if (getUserError || !userData?.user) {
      console.error('Get user error:', getUserError)
      return { error: 'Usuário não encontrado.', success: false }
    }

    const { error } = await admin.auth.admin.updateUserById(userData.user.id, { password })

    if (error) {
      console.error('Update user error:', error)
      return { error: 'Erro ao atualizar senha.', success: false }
    }

    redirect('/login')
  } catch (err: any) {
    if (err.digest?.startsWith('NEXT_REDIRECT')) {
      throw err
    }
    console.error('Reset password error:', err)
    return { error: 'Link expirado. Solicite um novo link.', success: false }
  }
}
