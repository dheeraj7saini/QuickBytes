const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const rawServerBaseUrl = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8080'

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '')
const SERVER_BASE_URL = rawServerBaseUrl.replace(/\/$/, '')

export { API_BASE_URL, SERVER_BASE_URL }
