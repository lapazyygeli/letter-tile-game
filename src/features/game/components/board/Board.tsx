import { useMemo, useRef } from 'react'
import { positionToKey } from '../../engine/board'
import { useGameStore } from '../../hooks/useGameStore'
import { useCellsToRender } from '../../hooks/useCellsToRender'
import type { Position } from '../../types'
import { BoardCell } from './BoardCell'
import { ZoomControls } from './ZoomControls'
import { usePanZoom } from '../../hooks/usePanZoom'

type BoardProps = {
  activeDragPosition: Position | null
  dragSourcePosition?: Position | null
}

export function Board({ activeDragPosition, dragSourcePosition }: BoardProps) {
  const board = useGameStore((state) => state.board)
  const invalidCells = useGameStore((state) => state.invalidCells)

  const viewportRef = useRef<HTMLDivElement>(null)
  const { worldRef, zoomIn, zoomOut } = usePanZoom(viewportRef)

  const invalidCellsAsKeys = useMemo(
    () => new Set(invalidCells.map(positionToKey)),
    [invalidCells],
  )

  const cellsToRender = useCellsToRender({
    board,
    activeDragPosition,
    dragSourcePosition,
  })

  // The div (with absolute top-1/2 left-1/2) has no width and height.
  // It is only an element to which BoardCells are attached relative to.
  // In the beginning, this div is at the origin of the board (because of
  // top-1/2 left-1/2) until it is dragged.
  // When dragged it is the origin for its own cells to render (For more info
  // check out BoardCell.). But it's not the origin of the gameboard itself.
  // The main origin of the board is the center of the viewport div
  // (div with the viewportRef), and that is defined in usePanZoom.
  // usePanZoom returns the coordinates for (absolute div) and tells
  // how much to move and where.
  //
  // TO MAKE IT CLEAR:
  // We have a `div` with a viewport reference. Its center point serves as a primary origin.
  // Inside it, there is a second `div` that is moved using a CSS transform. This second `div`
  // has its own origin, relative to which the tiles are drawn. `usePanZoom` provides coordinates
  // indicating how much the coordinate system of this second origin is shifted relative to the
  // origin of the viewportRef `div`. The viewportRef `div` remains stationary, so its origin
  // also remains fixed relative to itself; however, the origin of the second `div` does not
  // remain fixed relative to the origin of the viewportRef`div`.
  return (
    <div
      ref={viewportRef}
      onDragStart={(event) => event.preventDefault()}
      className='relative h-full w-full touch-none overflow-hidden select-none'
    >
      <div
        ref={worldRef}
        className='absolute top-1/2 left-1/2 lg:transition-[scale()] lg:duration-150 lg:ease-out'
        style={{ transform: 'translate(0px, 0px) scale(1)' }}
      >
        {cellsToRender.map((pos: Position) => {
          const key = positionToKey(pos)
          return (
            <BoardCell
              key={key}
              tile={board[key]}
              pos={pos}
              isInvalid={invalidCellsAsKeys.has(key)}
            />
          )
        })}
      </div>
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
    </div>
  )
}
