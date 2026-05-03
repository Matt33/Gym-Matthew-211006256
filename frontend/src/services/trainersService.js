import { apiClient } from './apiClient'

export async function getAllTrainers() {
  const res = await apiClient.get('/trainers')
  return res.data
}

export async function getTrainerById(id) {
  const res = await apiClient.get(`/trainers/${id}`)
  return res.data
}

export async function createTrainer(payload) {
  const res = await apiClient.post('/trainers', payload)
  return res.data
}

export async function updateTrainer(id, payload) {
  const res = await apiClient.put(`/trainers/${id}`, payload)
  return res.data
}

export async function deleteTrainer(id) {
  await apiClient.delete(`/trainers/${id}`)
}

