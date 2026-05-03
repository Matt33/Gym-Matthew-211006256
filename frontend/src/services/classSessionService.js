import { apiClient } from './apiClient'

export async function getAllSessions() {
  const res = await apiClient.get('/api/sessions')
  return res.data
}

export async function getSessionsByClassId(classId) {
  const res = await apiClient.get(`/api/sessions/class/${classId}`)
  return res.data
}

export async function getSessionById(id) {
  const res = await apiClient.get(`/api/sessions/${id}`)
  return res.data
}

export async function createSession(payload) {
  const res = await apiClient.post('/api/sessions', payload)
  return res.data
}

export async function updateSession(id, payload) {
  const res = await apiClient.put(`/api/sessions/${id}`, payload)
  return res.data
}

export async function deleteSession(id) {
  await apiClient.delete(`/api/sessions/${id}`)
}
