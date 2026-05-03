import { apiClient } from './apiClient'

export async function getProfile() {
  const res = await apiClient.get('/api/profile')
  return res.data
}

export async function updateProfile(payload) {
  const res = await apiClient.put('/api/profile', payload)
  return res.data
}

export async function getAllMembers() {
  const res = await apiClient.get('/api/profile/members')
  return res.data
}
