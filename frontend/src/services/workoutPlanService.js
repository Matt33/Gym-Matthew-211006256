import { apiClient } from './apiClient'

export async function getAllWorkoutPlans() {
  const res = await apiClient.get('/api/workout-plans')
  return res.data
}

export async function getMyWorkoutPlans() {
  const res = await apiClient.get('/api/workout-plans/my-plans')
  return res.data
}

export async function getWorkoutPlanById(id) {
  const res = await apiClient.get(`/api/workout-plans/${id}`)
  return res.data
}

export async function getWorkoutPlansByUserId(userId) {
  const res = await apiClient.get(`/api/workout-plans/user/${userId}`)
  return res.data
}

export async function createWorkoutPlan(payload) {
  const res = await apiClient.post('/api/workout-plans', payload)
  return res.data
}

export async function updateWorkoutPlan(id, payload) {
  const res = await apiClient.put(`/api/workout-plans/${id}`, payload)
  return res.data
}

export async function deleteWorkoutPlan(id) {
  await apiClient.delete(`/api/workout-plans/${id}`)
}
