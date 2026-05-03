import { apiClient } from './apiClient'

export async function getAllProgress() {
  const res = await apiClient.get('/api/progress')
  return res.data
}

export async function getMyProgress() {
  const res = await apiClient.get('/api/progress/my-progress')
  return res.data
}

export async function getProgressByUserId(userId) {
  const res = await apiClient.get(`/api/progress/user/${userId}`)
  return res.data
}

export async function createProgress(payload) {
  const res = await apiClient.post('/api/progress', payload)
  return res.data
}

export async function updateProgress(id, payload) {
  const res = await apiClient.put(`/api/progress/${id}`, payload)
  return res.data
}

export async function deleteProgress(id) {
  await apiClient.delete(`/api/progress/${id}`)
}
