import type { PlacedTileMap, Position } from '../../types.ts'
import { STARTER_RADIUS } from '../../constants.ts'

import { ZoomControls } from './ZoomControls'

export function Board() {
  const world = {
    origin: {
      x: 0,
      y: 0,
    },
    zoom: 1,
  }

  const board: PlacedTileMap = {}
  const cellsToRender = getCellsToRender(board)

  return (
    <div className='relative h-full w-full'>
      <div
        className={`absolute top-1/2 left-1/2`}
        style={{
          transform: `translate(${world.origin.x}px, ${world.origin.y}px) scale(${world.zoom})`,
        }}
      >
        {cellsToRender.map((pos: Position) => (
          <div>
            x: {pos.x} y: {pos.y}
          </div>
        ))}
      </div>
      <ZoomControls onZoomIn={() => {}} onZoomOut={() => {}} />
    </div>
  )
}

function getCellsToRender(board: PlacedTileMap): Position[] {
  const cellsToRender: Position[] = []
  const addToCellsToRender = (cell: Position) => {
    cellsToRender.push(cell)
  }

  const occupiedPositions: string[] = Object.keys(board)
  const isBoardEmpty = occupiedPositions.length === 0
  if (isBoardEmpty) {
    const addCellsForEmptyBoard = () => {
      for (let x = -STARTER_RADIUS; x <= STARTER_RADIUS; x++) {
        for (let y = -STARTER_RADIUS; y <= STARTER_RADIUS; y++) {
          addToCellsToRender({ x, y })
        }
      }
    }
    addCellsForEmptyBoard()
    return cellsToRender
  }
}
