import { useCallback, useEffect, useRef, type RefObject } from 'react'
import type { Position } from '../types.ts'
import { CELL_SIZE, MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../constants.ts'

type PointerPoint = { x: number; y: number }

type BoardView = {
  origin: Position
  zoom: number
}

/**
 * The coordinate system works so that:
 * - the horizontal axis goes from left to right, from negative to positive
 * - the vertical axis goes from top to bottom, from negative to positive
 * - the origin is in the middle of the board, not in the top left corner
 *
 * Checkout Board.tsx:
 * We have a `div` with a viewport reference. Its center point serves as a primary origin.
 * Inside it, there is a second `div` that is moved using a CSS transform. This second `div`
 * has its own origin, relative to which the tiles are drawn. `usePanZoom` provides coordinates
 * indicating how much the coordinate system of this second origin is shifted relative to the
 * origin of the viewportRef `div`. The viewportRef `div` remains stationary, so its origin
 * also remains fixed relative to itself; however, the origin of the second `div` does not
 * remain fixed relative to the origin of the viewportRef`div`.
 *
 * @param viewportRef Reference to the fixed viewport element that receives pointer and wheel events.
 * @returns
 * - `worldRef` A ref to the element which is wanted to be movable (allow pan and zoom)
 * - `centerOn` Centers the board on the given board position.
 * - `zoomIn` Zooms in by one `ZOOM_STEP`.
 * - `zoomOut` Zooms out by one `ZOOM_STEP`.
 */
export function usePanZoom(viewportRef: RefObject<HTMLDivElement | null>) {
  // The actual element to make css transformations
  const worldRef = useRef<HTMLDivElement>(null)

  // Tells where the origin of the board is relative to world's
  // fixed origin and the zoom level. In the beginning the board's origin
  // is in the same position as world's origin.
  const boardViewRef = useRef<BoardView>({ origin: { x: 0, y: 0 }, zoom: 1 })

  // Which pointers are currently active, and where are they
  const pointers = useRef(new Map<number, PointerPoint>())

  // What was the distance between the fingers in the previous measurement
  const pinchStartDistance = useRef<number | null>(null)

  // Where did drag begin, and where was the boardView then?
  const panStart = useRef<{
    pointerX: number
    pointerY: number
    boardX: number
    boardY: number
  } | null>(null)

  /**
   * `worldRef` gives direct access to the element's APIS. We can then directly access its CSSOM
   *  and modify it here using this transformation. This way, there is no need to use `useState`
   *  and trigger unnecessary re-renders.
   */
  const applyTransform = useCallback(() => {
    const world = worldRef.current
    if (!world) return
    const { origin, zoom } = boardViewRef.current
    world.style.transform = `translate(${origin.x}px, ${origin.y}px) scale(${zoom})`
  }, [])

  /**
   * Center based on the latest dropped tile.
   */
  const centerOn = useCallback(
    (position: Position) => {
      const { zoom } = boardViewRef.current

      boardViewRef.current = {
        ...boardViewRef.current,
        origin: {
          x: -position.x * CELL_SIZE * zoom,
          y: -position.y * CELL_SIZE * zoom,
        },
      }

      applyTransform()
    },
    [applyTransform],
  )

  /**
   * Changes the boardView's zoom level while keeping the cursor position
   * fixed relative to the board.
   *
   * @param delta The amount by which to change the current zoom level. delta > 0 -> zoom out, delta < 0 -> zoom in
   * @param cursorPosition The cursor's position in the board's coordinate system.
   */
  const zoomBy = useCallback(
    (delta: number, cursorPosition?: PointerPoint) => {
      const prev = boardViewRef.current
      const nextZoom = clamp(prev.zoom + delta, MIN_ZOOM, MAX_ZOOM)

      if (!cursorPosition) {
        boardViewRef.current = { ...prev, zoom: nextZoom }
        applyTransform()
        return
      }

      // By what factor the world becomes larger or smaller compared to the previous zoom level.
      // E.g.: For example, if: prev.zoom = 1; nextZoom = 2; then: ratio = 2 / 1 = 2;
      // In other words, all distances from the board origin are doubled.
      // Also when zooming happens we have to also change x,y-coordinates correspondingly
      const ratio = nextZoom / prev.zoom
      boardViewRef.current = {
        zoom: nextZoom,
        origin: {
          x: cursorPosition.x - (cursorPosition.x - prev.origin.x) * ratio,
          y: cursorPosition.y - (cursorPosition.y - prev.origin.y) * ratio,
        },
      }
      applyTransform()
    },
    [applyTransform],
  )

  useEffect(() => {
    const viewportDiv = viewportRef.current
    if (!viewportDiv) return

    /**
     * Find the cursor's x and y coordinates in our own coordinate system.
     * (Converts the cursor position from the browser's client coordinate
     * system to the board's own coordinate system.)
     *
     * The returned coordinates are relative to the board's center, which acts
     * the origin (0, 0) of the board coordinate system.
     *
     * @param clientX The X coordinate of the mouse pointer in browser viewport coordinates.
     * @param clientY The Y coordinate of the mouse pointer in browser viewport coordinates.
     * @returns The cursor's position in the board's own coordinate system.
     */
    const getCursorPositionInBoardCoordinates = (
      clientX: number,
      clientY: number,
    ) => {
      const rect = viewportDiv.getBoundingClientRect()
      return {
        // clientX - rect.left: tells the distance from sidebar
        // why this: - rect.width / 2, because: the origin is in the middle of the board.
        // so to find the actual position relative the our own coordinates system we have
        // to minux half of the board width. Remember: this coordinate system uses negatives
        // and the origin is in the middle.
        x: clientX - rect.left - rect.width / 2,
        y: clientY - rect.top - rect.height / 2,
      }
    }

    /**
     * `wheel` event's callback
     */
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const cursorPosition = getCursorPositionInBoardCoordinates(
        event.clientX,
        event.clientY,
      )
      // event.deltaY > 0 -> zoom out, event.deltaY < 0 -> zoom in
      zoomBy(event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP, cursorPosition)
    }

    const handlePointerDown = (event: PointerEvent) => {
      // Ignore pointerdown events that start on a draggable element
      // React's synthetic event bubbling only occurs at the React root, which is
      // above this node. By that point, the native event has already bubbled
      // up to this level before React's stopPropagation executes.
      // Checking the attribute is therefore the only reliable way to filter these out.
      if ((event.target as HTMLElement | null)?.closest('[data-tile-handle]')) {
        return
      }

      // Prevent the browser's native text selection, which could
      // trigger during rapid mouse movement and capture the cursor
      // (would appear as a red "not allowed" icon)
      if (event.pointerType === 'mouse') {
        event.preventDefault()
      }

      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })

      // For just one touch
      if (pointers.current.size === 1) {
        panStart.current = {
          pointerX: event.clientX,
          pointerY: event.clientY,
          boardX: boardViewRef.current.origin.x,
          boardY: boardViewRef.current.origin.y,
        }
      }

      // Start pinch tracking
      if (pointers.current.size === 2) {
        pinchStartDistance.current = getPointerDistance(pointers.current)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointers.current.has(event.pointerId)) return

      // Handle situtations where mouse button released outside the viewport
      if (event.pointerType !== 'touch' && event.buttons === 0) {
        pointers.current.delete(event.pointerId)
        if (pointers.current.size < 2) pinchStartDistance.current = null
        if (pointers.current.size === 0) panStart.current = null
        return
      }

      // Update the pointer's current position when moving is happening
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })

      // Two pointers: handle pinch zoom
      if (pointers.current.size === 2 && pinchStartDistance.current) {
        const distance = getPointerDistance(pointers.current)
        const scale = distance / pinchStartDistance.current
        pinchStartDistance.current = distance
        const midpoint = getPointerMidpoint(pointers.current)
        zoomBy(
          (scale - 1) * boardViewRef.current.zoom,
          getCursorPositionInBoardCoordinates(midpoint.x, midpoint.y),
        )
        return
      }

      // One pointer: dragging
      if (pointers.current.size === 1 && panStart.current) {
        const { pointerX, pointerY, boardX, boardY } = panStart.current
        const dx = event.clientX - pointerX
        const dy = event.clientY - pointerY

        boardViewRef.current = {
          ...boardViewRef.current,
          origin: { x: boardX + dx, y: boardY + dy },
        }
        applyTransform()
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId)

      if (pointers.current.size < 2) {
        pinchStartDistance.current = null
      }

      if (pointers.current.size === 0) {
        panStart.current = null
        return
      }

      // Going from a two-finger pinch back to one finger: re-baseline pan
      // using the remaining pointer's last known position and the boardView's
      // current (post-zoom) position. Without this, panStart still holds the
      // value from before the pinch started and the next move jumps the
      // boardView by a large, seemingly random amount.
      if (pointers.current.size === 1) {
        const [remaining] = Array.from(pointers.current.values())
        panStart.current = {
          pointerX: remaining.x,
          pointerY: remaining.y,
          boardX: boardViewRef.current.origin.x,
          boardY: boardViewRef.current.origin.y,
        }
      }
    }

    viewportDiv.addEventListener('wheel', handleWheel, { passive: false })
    viewportDiv.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      viewportDiv.removeEventListener('wheel', handleWheel)
      viewportDiv.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [viewportRef, zoomBy])

  return {
    worldRef,
    centerOn,
    zoomIn: () => zoomBy(ZOOM_STEP),
    zoomOut: () => zoomBy(-ZOOM_STEP),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getPointerDistance(pointers: Map<number, PointerPoint>): number {
  const [a, b] = Array.from(pointers.values())
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function getPointerMidpoint(pointers: Map<number, PointerPoint>): PointerPoint {
  const [a, b] = Array.from(pointers.values())
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}
