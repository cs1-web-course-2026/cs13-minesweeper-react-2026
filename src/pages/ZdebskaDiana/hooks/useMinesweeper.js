import { useCallback, useMemo, useState } from 'react'
import {
  CELL_CONTENT,
  CELL_STATE,
  DEFAULT_COLS,
  DEFAULT_MINE_COUNT,
  DEFAULT_ROWS,
  DIRECTIONS,
  GAME_STATUS,
} from '../constants'
import {
  checkWin,
  cloneBoard,
  generateField,
  getFlaggedCount,
  isInBounds,
} from '../utils'

function openCellRecursive(board, row, col, rows, cols) {
  const cell = board[row][col]

  if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return

  cell.state = CELL_STATE.OPENED

  if (cell.type === CELL_CONTENT.MINE) return

  if (cell.neighborMines === 0) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr
      const nc = col + dc
      if (isInBounds(nr, nc, rows, cols)) {
        openCellRecursive(board, nr, nc, rows, cols)
      }
    }
  }
}

function revealAllMines(board, triggeredRow, triggeredCol) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const cell = board[r][c]
      if (cell.type === CELL_CONTENT.MINE && cell.state !== CELL_STATE.FLAGGED) {
        cell.state = CELL_STATE.OPENED
        cell.triggered = r === triggeredRow && c === triggeredCol
      }
      if (cell.type !== CELL_CONTENT.MINE && cell.state === CELL_STATE.FLAGGED) {
        cell.wrongFlag = true
      }
    }
  }
}

export function useMinesweeper({
  rows = DEFAULT_ROWS,
  cols = DEFAULT_COLS,
  minesCount = DEFAULT_MINE_COUNT,
} = {}) {
  const [status, setStatus] = useState(GAME_STATUS.IDLE)
  const [board, setBoard] = useState(() => generateField(rows, cols, minesCount))

  const flaggedCount = useMemo(() => getFlaggedCount(board), [board])
  const remainingFlags = Math.max(minesCount - flaggedCount, 0)

  const restart = useCallback(() => {
    setStatus(GAME_STATUS.IDLE)
    setBoard(generateField(rows, cols, minesCount))
  }, [cols, minesCount, rows])

  const handleCellClick = useCallback(
    (row, col) => {
      if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return

      const working = cloneBoard(board)

      if (status === GAME_STATUS.IDLE) {
        setStatus(GAME_STATUS.PLAYING)
      }

      const cell = working[row][col]
      if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
        setBoard(working)
        return
      }

      openCellRecursive(working, row, col, rows, cols)

      if (cell.type === CELL_CONTENT.MINE) {
        cell.triggered = true
        revealAllMines(working, row, col)
        setBoard(working)
        setStatus(GAME_STATUS.LOST)
        return
      }

      if (status === GAME_STATUS.PLAYING || status === GAME_STATUS.IDLE) {
        const isWon = checkWin(working)
        if (isWon) {
          setStatus(GAME_STATUS.WON)
        }
      }

      setBoard(working)
    },
    [board, cols, rows, status]
  )

  const handleRightClick = useCallback(
    (e, row, col) => {
      e.preventDefault()
      if (status !== GAME_STATUS.PLAYING) return

      const cell = board[row][col]
      if (cell.state === CELL_STATE.OPENED) return

      const isFlagged = cell.state === CELL_STATE.FLAGGED
      if (!isFlagged && remainingFlags <= 0) return

      const next = cloneBoard(board)
      next[row][col].state = isFlagged ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED
      setBoard(next)

      const isWon = checkWin(next)
      if (isWon) setStatus(GAME_STATUS.WON)
    },
    [board, remainingFlags, status]
  )

  return {
    rows,
    cols,
    minesCount,
    board,
    status,
    flaggedCount,
    remainingFlags,
    restart,
    handleCellClick,
    handleRightClick,
  }
}

