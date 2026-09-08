// width and height
export const CELL_SIZE = 52

export const MIN_ZOOM = 0.3
export const MAX_ZOOM = 2.5
export const ZOOM_STEP = 0.15

// How many empty cells to reveal around dropped tiles
export const VISIBLE_PADDING = 2

// How many empty cells to reveal during the active tile drag
export const DRAG_REVEAL_RADIUS = 2

// Empty board starter area radius (radius in cells, so e.g. 3 -> 7x7 ( (3+1+3)^2 ) ).
export const STARTER_RADIUS = 3

// Tile amount in the beginning of the game.
export const HAND_SIZE = 21

// How many tiles are exchanged when an exchange happens
export const MIN_TILES_TO_EXCHANGE = 3

// 144-tile letter distribution.
export const LETTER_DISTRIBUTION: Record<string, number> = {
  A: 13,
  B: 3,
  C: 3,
  D: 6,
  E: 18,
  F: 3,
  G: 4,
  H: 3,
  I: 12,
  J: 2,
  K: 2,
  L: 5,
  M: 3,
  N: 8,
  O: 11,
  P: 3,
  Q: 2,
  R: 9,
  S: 6,
  T: 9,
  U: 6,
  V: 3,
  W: 3,
  X: 2,
  Y: 2,
  Z: 2,
}

/* export const LETTER_DISTRIBUTION: Record<string, number> = {
  D: 2,
  G: 1,
  O: 1,
  E: 1,
} */
