const AUTH_TOKEN_KEY = 'yolohome.auth.token'

export function getStoredAuthToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export function hasStoredAuthToken() {
  return Boolean(getStoredAuthToken())
}

export function setStoredAuthToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearStoredAuthToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}
