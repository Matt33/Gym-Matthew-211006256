import { apiClient } from './apiClient'

export async function enrollInClass(classId) {
  const res = await apiClient.post(`/enrollments/${classId}`)
  return res.data
}

export async function getMyClasses() {
  const res = await apiClient.get('/enrollments/my-classes')
  return res.data
}
export async function unenrollFromClass(gymClassId) {
  await apiClient.delete(`/enrollments/${gymClassId}`)
}
