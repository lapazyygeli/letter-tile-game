export function requireEnv(value: string | undefined): string {
  if (!value) throw new Error('Environment variable value undefined')
  return value
}
