import { apiClient } from './apiClient'

export async function login(email, password) {
  const res = await apiClient.post('/api/auth/login', {
    email,
    password,
  })
  return res.data
}

export async function register(payload) {
  const res = await apiClient.post('/api/auth/register', payload)
  return res.data
}

