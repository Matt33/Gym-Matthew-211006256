import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5108'

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

