export const DEFAULT_ROWS = 8
export const DEFAULT_COLS = 8
export const DEFAULT_MINE_COUNT = 10

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'process',
  WON: 'win',
  LOST: 'lose',
}

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
}

export const CELL_CONTENT = {
  MINE: 'mine',
  EMPTY: 'empty',
}

export const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

