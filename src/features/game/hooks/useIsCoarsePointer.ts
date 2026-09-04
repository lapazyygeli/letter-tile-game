import { useEffect, useState } from 'react'

const COARSE_POINTER_QUERY = '(pointer: coarse)'

/**
 * True when the primary pointing device is "coarse" (touch), false when
 * it's "fine" (mouse/trackpad/pen). UA-sniffing-free
 * way to distinguish mobile device from desktop input
 */
export function useIsCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState(
    () => window.matchMedia(COARSE_POINTER_QUERY).matches,
  )

  useEffect(() => {
    const mediaQueryList = window.matchMedia(COARSE_POINTER_QUERY)
    const handleChange = () => setIsCoarse(mediaQueryList.matches)

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  return isCoarse
}
