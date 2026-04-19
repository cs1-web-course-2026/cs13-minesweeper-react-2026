import { useState, useCallback, useMemo } from 'react'

const ROWS = 6
const COLS = 8
const DEFAULT_MINES = 10

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isRevealed: false,
      isMine: false,
      isFlagged: false,
      isExploded: false,
      neighborCount: 0,
    }))
  )
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

function placeMines(board, clickedRow, clickedCol, mineCount) {
  const next = cloneBoard(board)
  let placed = 0
  while (placed < mineCount) {
    const row = Math.floor(Math.random() * ROWS)
    const col = Math.floor(Math.random() * COLS)
    if (!next[row][col].isMine && !(row === clickedRow && col === clickedCol)) {
      next[row][col].isMine = true
      placed++
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (next[r][c].isMine) continue
      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const nr = r + i
          const nc = c + j
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && next[nr][nc].isMine) {
            count++
          }
        }
      }
      next[r][c].neighborCount = count
    }
  }
  return next
}

function revealNeighbors(row, col, board) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nr = row + i
      const nc = col + j
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue
      if (board[nr][nc].isRevealed || board[nr][nc].isFlagged) continue
      board[nr][nc].isRevealed = true
      if (board[nr][nc].neighborCount === 0 && !board[nr][nc].isMine) {
        revealNeighbors(nr, nc, board)
      }
    }
  }
}

function countRevealedNonMines(board) {
  let n = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) n++
    }
  }
  return n
}

export function useMinesweeper() {
  const [board, setBoard] = useState(() => createEmptyBoard())
  const [gameStatus, setGameStatus] = useState('playing')
  const [isFirstClick, setIsFirstClick] = useState(true)
  const mineCount = DEFAULT_MINES

  const flagCount = useMemo(
    () => board.flat().filter((c) => c.isFlagged).length,
    [board]
  )

  const restart = useCallback(() => {
    setBoard(createEmptyBoard())
    setGameStatus('playing')
    setIsFirstClick(true)
  }, [])

  const handleCellClick = useCallback(
    (row, col) => {
      if (gameStatus !== 'playing') return

      let working = board
      if (isFirstClick) {
        working = placeMines(board, row, col, mineCount)
        setIsFirstClick(false)
      }

      if (working[row][col].isRevealed || working[row][col].isFlagged) {
        if (working !== board) setBoard(working)
        return
      }

      const next = cloneBoard(working)
      next[row][col].isRevealed = true

      if (next[row][col].isMine) {
        next[row][col].isExploded = true
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (next[r][c].isMine) next[r][c].isRevealed = true
          }
        }
        setBoard(next)
        setGameStatus('lost')
        return
      }

      if (next[row][col].neighborCount === 0) {
        revealNeighbors(row, col, next)
      }

      setBoard(next)

      const revealed = countRevealedNonMines(next)
      if (revealed === ROWS * COLS - mineCount) {
        setGameStatus('won')
      }
    },
    [board, gameStatus, isFirstClick, mineCount]
  )

  const handleRightClick = useCallback(
    (e, row, col) => {
      e.preventDefault()
      if (gameStatus !== 'playing' || board[row][col].isRevealed) return
      const next = cloneBoard(board)
      next[row][col].isFlagged = !next[row][col].isFlagged
      setBoard(next)
    },
    [board, gameStatus]
  )

  return {
    board,
    gameStatus,
    mineCount,
    flagCount,
    rows: ROWS,
    cols: COLS,
    restart,
    handleCellClick,
    handleRightClick,
  }
}
