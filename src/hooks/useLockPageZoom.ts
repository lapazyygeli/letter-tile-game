import { useEffect } from 'react'

/**
 * Pinch zoom carries over between routes because navigation happens client
 * side. Capping `maximum-scale` at 1 makes mobile browsers snap back to the
 * normal zoom level and keeps it there until the lock is released.
 */
export function useLockPageZoom(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const viewport = document.querySelector<HTMLMetaElement>(
      'meta[name="viewport"]',
    )
    if (!viewport) return

    const previousContent = viewport.content
    viewport.content = `${previousContent}, maximum-scale=1`

    return () => {
      viewport.content = previousContent
    }
  }, [isLocked])
}
