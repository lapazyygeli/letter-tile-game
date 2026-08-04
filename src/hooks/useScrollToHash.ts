import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function useScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const section = document.querySelector(location.hash)
    section?.scrollIntoView({ behavior: 'smooth' })

    const onScroll = () => {
      const rect = section?.getBoundingClientRect()
      if (!rect) return

      if (rect.top >= window.innerHeight || rect.bottom <= 0) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        )
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [location])
}
