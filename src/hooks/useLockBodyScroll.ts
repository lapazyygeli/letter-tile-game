import { useEffect } from 'react'

export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return

    const scrollY = window.scrollY
    const { style } = document.body
    const previousOverscrollBehavior =
      document.documentElement.style.overscrollBehavior

    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.overflow = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'

    return () => {
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.overflow = ''
      document.documentElement.style.overscrollBehavior =
        previousOverscrollBehavior
      window.scrollTo(0, scrollY)
    }
  }, [isLocked])
}
