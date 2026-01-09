import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash)
      section?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return null
}
