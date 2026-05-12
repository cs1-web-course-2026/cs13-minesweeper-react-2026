import { useState, useCallback, useMemo } from 'react'
import { GAME_STATUS } from '../constants/gameStatus'
import {
  createEmptyBoard,
  cloneBoard,
  placeMines,
  revealNeighbors,
  countRevealedNonMines,
} from '../utils'

const ROWS = 6
const COLS = 8
const DEFAULT_MINES = 10

export function useMinesweeper() {
  const [board, setBoard] = useState(() => createEmptyBoard())
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING)
  const [isFirstClick, setIsFirstClick] = useState(true)
  const mineCount = DEFAULT_MINES

  const flagCount = useMemo(
    () => board.flat().filter((c) => c.isFlagged).length,
    [board]
  )

  const restart = useCallback(() => {
    setBoard(createEmptyBoard())
    setGameStatus(GAME_STATUS.PLAYING)
    setIsFirstClick(true)
  }, [])

  const handleCellClick = useCallback(
    (row, col) => {
      if (gameStatus !== GAME_STATUS.PLAYING) return

      let working = board
      if (isFirstClick) {
        working = placeMines(board, row, col, mineCount)
        setIsFirstClick(false)
      }

      if (working[row][col].isRevealed || working[row][col].isFlagged) {
        if (working !== board) setBoard(working)
        return
      }

      let next = cloneBoard(working)
      next[row][col].isRevealed = true

      if (next[row][col].isMine) {
        next[row][col].isExploded = true
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            if (next[row][col].isMine) next[row][col].isRevealed = true
          }
        }
        setBoard(next)
        setGameStatus(GAME_STATUS.LOST)
        return
      }

      if (next[row][col].neighborCount === 0) {
        next = revealNeighbors(row, col, next)
      }

      setBoard(next)

      const revealed = countRevealedNonMines(next)
      if (revealed === ROWS * COLS - mineCount) {
        setGameStatus(GAME_STATUS.WON)
      }
    },
    [board, gameStatus, isFirstClick, mineCount]
  )

  const handleRightClick = useCallback(
    (e, row, col) => {
      e.preventDefault()
      if (gameStatus !== GAME_STATUS.PLAYING || board[row][col].isRevealed) return
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
