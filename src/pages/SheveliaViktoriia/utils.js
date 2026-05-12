const ROWS = 6
const COLS = 8

export function createEmptyBoard() {
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

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

export function placeMines(board, clickedRow, clickedCol, mineCount) {
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

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (next[row][col].isMine) continue

      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const neighbourRow = row + i
          const neighbourCol = col + j
          if (
            neighbourRow >= 0 &&
            neighbourRow < ROWS &&
            neighbourCol >= 0 &&
            neighbourCol < COLS &&
            next[neighbourRow][neighbourCol].isMine
          ) {
            count++
          }
        }
      }

      next[row][col].neighborCount = count
    }
  }

  return next
}

export function revealNeighbors(row, col, board) {
  const result = cloneBoard(board)
  const stack = [[row, col]]

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop()

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighbourRow = currentRow + i
        const neighbourCol = currentCol + j

        const isOutOfBounds =
          neighbourRow < 0 ||
          neighbourRow >= ROWS ||
          neighbourCol < 0 ||
          neighbourCol >= COLS

        if (isOutOfBounds) continue
        if (neighbourRow === currentRow && neighbourCol === currentCol) continue

        const neighbourCell = result[neighbourRow][neighbourCol]
        if (neighbourCell.isRevealed || neighbourCell.isFlagged || neighbourCell.isMine) continue

        neighbourCell.isRevealed = true

        if (neighbourCell.neighborCount === 0) {
          stack.push([neighbourRow, neighbourCol])
        }
      }
    }
  }

  return result
}

export function countRevealedNonMines(board) {
  let count = 0
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col].isRevealed && !board[row][col].isMine) count++
    }
  }
  return count
}
