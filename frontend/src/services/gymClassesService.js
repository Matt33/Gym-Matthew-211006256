import { apiClient } from './apiClient'

export async function getAllClasses() {
  const res = await apiClient.get('/classes')
  return res.data
}

export async function getClassById(id) {
  const res = await apiClient.get(`/classes/${id}`)
  return res.data
}

export async function createClass(payload) {
  const res = await apiClient.post('/classes', payload)
  return res.data
}

export async function updateClass(id, payload) {
  const res = await apiClient.put(`/classes/${id}`, payload)
  return res.data
}

export async function deleteClass(id) {
  await apiClient.delete(`/classes/${id}`)
}

