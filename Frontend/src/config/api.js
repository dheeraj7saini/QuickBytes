const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL
const rawServerBaseUrl = import.meta.env.VITE_SERVER_BASE_URL

if (!rawApiBaseUrl || !rawServerBaseUrl) {
  throw new Error(
    'Missing Vercel environment variables: VITE_API_BASE_URL and VITE_SERVER_BASE_URL',
  )
}

const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '')
const SERVER_BASE_URL = rawServerBaseUrl.replace(/\/$/, '')

export { API_BASE_URL, SERVER_BASE_URL }
