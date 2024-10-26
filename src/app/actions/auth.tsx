'use server'
import { LoginFormSchema, FormState } from '@/app/lib/definitions'
import { loginUser } from '@/services/login'
import { createSession, deleteSession, verifySession } from '../lib/session'
import { redirect } from 'next/navigation'

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })


  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data
  const payload: any = { emailId: email, pin: password }

  const response: any = await loginUser(payload)

  await createSession(response?.token)
  await verifySession()

  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}