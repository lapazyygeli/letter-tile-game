const API_URL = import.meta.env.VITE_API_URL

export const signup = async (username: string, password: string) => {
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
  return res
}
