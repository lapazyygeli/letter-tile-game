const API_URL = import.meta.env.VITE_API_URL

export const signup = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  const res = await fetch(`${API_URL}/api/v1/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? 'Signup failed')
  }
  return data
}

export const login = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  const res = await fetch(`${API_URL}/api/v1/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message ?? 'Login failed')
  }
  return data
}
