import { create } from 'zustand'

import { createTileBag, drawTiles } from '../engine/distribution'
import { HAND_SIZE, MIN_TILES_TO_EXCHANGE } from '../constants'
import { getTileAt, placeTileAt, removeTileAt } from '../engine/board'
import type {
  GameResult,
  LetterTile,
  PlacedTile,
  PlacedTileMap,
  Position,
} from '../types'
import { loadDictionary } from '../engine/dictionary'
import { evaluateBoard } from '../engine/util'

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
} as const

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

type GameStoreState = {
  status: GameStatus
  hand: LetterTile[] // the cards that the user's having currectly
  board: PlacedTileMap
  bag: LetterTile[] // the left over cards (all cards - hand)
  elapsedSeconds: number
  lastPlacedPosition: Position | null
  invalidCells: Position[]
  lastResult: GameResult | null
  dictionary: Set<string> | null
}

type GameStoreActions = {
  start: () => Promise<void>
  placeTile: (
    tileId: string,
    letter: string,
    position: Position,
    source: 'hand' | 'board',
    fromPosition?: Position,
  ) => void
  returnTile: (position: Position) => void
  exchangeTile: (tileId: string) => void
  swapTiles: (sourcePos: Position, targetPos: Position) => void
  tick: () => void
  // Can be called at any time. Highlights invalid words in red; declares a
  // win only if every word is valid, the hand is empty, and the board forms
  // a single connected grid.
  checkWords: (onGameEnd?: (result: GameResult) => void) => void
}

type GameStore = GameStoreState & {
  actions: GameStoreActions
}

const initialState: GameStoreState = {
  status: GAME_STATUS.IDLE,
  hand: [],
  board: {},
  bag: [],
  elapsedSeconds: 0,
  lastPlacedPosition: null,
  invalidCells: [],
  lastResult: null,
  dictionary: null,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  actions: {
    /**
     * Starts a new game by loading the dictionary, creating a shuffled tile bag,
     * and drawing the initial hand of tiles. Doesn't mean drawing on a screen,
     * but rather pulling from the bag.
     */
    start: async () => {
      const dictionary = await loadDictionary('en')
      const { drawn, remaining } = drawTiles(createTileBag(), HAND_SIZE)
      set({
        ...initialState,
        status: GAME_STATUS.PLAYING,
        hand: drawn,
        bag: remaining,
        dictionary,
      })
    },

    /**
     * Place a tile at the specified position in the board.
     *
     * If the tile is moved from another board position, it is first removed
     * from its previous position. Otherwise, the tile is removed from the hand.
     * If another tile already occupies the target position, that tile is moved
     * back to the hand.
     *
     * @param tileId - The id of the tile being placed.
     * @param letter - The letter on the tile.
     * @param position - The target position on the board.
     * @param source - Whether the tile is being moved from the hand or the board.
     * @param fromPosition - The tile's board position when moved from the board.,
     * while tile isn't in the board (hand) it doesn't include position.
     */
    placeTile: (tileId, letter, position, source, fromPosition) => {
      set((state) => {
        let hand = state.hand
        let board = state.board

        // First check if we move tile inside the board, from one pos to another.
        // If so we remove the tile from its original pos to allow it take another pos.
        // If not, it means we move tile from sidebar to board. Then
        // we remove the tile from the hand.
        const isBoardToBoardMove = source === 'board' && fromPosition
        if (isBoardToBoardMove) {
          board = removeTileAt(board, fromPosition)
        } else {
          hand = hand.filter((tile) => tile.id !== tileId)
        }

        // Check if we move a tile to a position where is already a tile.
        // If so, the old tile is removed and put back to the hand.
        const displaced = getTileAt(board, position)
        if (displaced) {
          hand = [...hand, { id: displaced.id, letter: displaced.letter }]
        }

        // Place the tile
        board = placeTileAt(board, { id: tileId, letter, ...position })

        // The board changed, so any previous "check" result is stale.
        return { hand, board, lastPlacedPosition: position, invalidCells: [] }
      })
    },

    /**
     *
     * @param position - The position of the tile being returned to the hand from the board
     */
    returnTile: (position) => {
      set((state) => {
        const tile = getTileAt(state.board, position)
        if (!tile) return state
        return {
          board: removeTileAt(state.board, position),
          hand: [...state.hand, { id: tile.id, letter: tile.letter }],
          invalidCells: [],
        }
      })
    },

    /**
     * Exchange a tile from the player's hand for a specified number of new tiles
     * from the bag (MIN_TILES_TO_EXCHANGE). The exchanged tile is returned to the bag.
     * The exchange is only performed if the bag contains enough tiles and the
     * specified tile exists in the player's hand.
     *
     * @param tileId - The id of the tile to exchange.
     */
    exchangeTile: (tileId) => {
      set((state) => {
        const hasEnoughTilesInBagForExchange =
          state.bag.length >= MIN_TILES_TO_EXCHANGE
        if (!hasEnoughTilesInBagForExchange) return state
        const tileToExhange = state.hand.find((tile) => tile.id === tileId)
        if (!tileToExhange) return state

        const { drawn, remaining } = drawTiles(state.bag, MIN_TILES_TO_EXCHANGE)
        return {
          hand: [...state.hand.filter((tile) => tile.id !== tileId), ...drawn],
          bag: [
            ...remaining,
            { id: tileToExhange.id, letter: tileToExhange.letter },
          ],
        }
      })
    },

    /**
     * Swap two tiles between board positions.
     *
     * If either position is empty, no changes are made.
     *
     * @param sourcePos - The board position of the first tile.
     * @param targetPos - The board position of the second tile.
     */
    swapTiles: (sourcePos, targetPos) => {
      set((state) => {
        const sourceTile = getTileAt(state.board, sourcePos)
        const targetTile = getTileAt(state.board, targetPos)
        if (!sourceTile || !targetTile) return state

        let board = removeTileAt(state.board, sourcePos)
        board = removeTileAt(board, targetPos)

        const targetTileAtSourcePosition: PlacedTile = {
          id: targetTile.id,
          letter: targetTile.letter,
          ...sourcePos,
        }
        board = placeTileAt(board, targetTileAtSourcePosition)

        const sourceTileAtTargetPosition: PlacedTile = {
          id: sourceTile.id,
          letter: sourceTile.letter,
          ...targetPos,
        }
        board = placeTileAt(board, sourceTileAtTargetPosition)

        return {
          board,
          lastPlacedPosition: targetPos,
          invalidCells: [],
        }
      })
    },

    /**
     * Advance the game timer by one tick. Tick is defined as seconds elsewhere.
     */
    tick: () => set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 })),

    checkWords: (onGameEnd) => {
      const { board, hand, elapsedSeconds, dictionary } = get()
      if (!dictionary) throw new Error('Dictionary not defined')

      const evaluation = evaluateBoard(board, hand, dictionary)

      // Board include invalid words or single letters
      if (evaluation.outcome === 'invalid') {
        set({ invalidCells: evaluation.invalidCells })
        return
      }

      // Board doesn't include invalid words or single letters, but
      // doesn't meet win condition.
      if (evaluation.outcome === 'not-won') {
        set({ invalidCells: [] })
        return
      }

      const result: GameResult = {
        mode: 'singleplayer',
        outcome: GAME_STATUS.WON,
        durationSeconds: elapsedSeconds,
        wordsFormed: evaluation.words.map(({ word }) => word),
        tilesPlaced: Object.keys(board).length,
        tilesInHand: hand.length,
        timestamp: new Date().toISOString(),
      }

      set({
        status: GAME_STATUS.WON,
        invalidCells: [],
        lastResult: result,
      })

      onGameEnd?.(result)
    },
  },
}))
