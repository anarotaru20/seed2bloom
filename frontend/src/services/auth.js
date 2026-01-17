import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL

export async function login(email, password) {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credentials.user.getIdToken()

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Login failed')

  return data
}

export async function register(email, password, profile) {
  const credentials = await createUserWithEmailAndPassword(auth, email, password)
  const idToken = await credentials.user.getIdToken()

  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, profile }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Register failed')

  return data
}

export async function getProfile() {
  const token = localStorage.getItem('jwt')

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to load profile')

  return data
}

export function logout() {
  localStorage.removeItem('auth_user')
  localStorage.removeItem('jwt')
}
