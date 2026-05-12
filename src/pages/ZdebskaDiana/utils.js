import { CELL_CONTENT, CELL_STATE, DIRECTIONS } from './constants'

export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols
}

export function createEmptyCell() {
  return {
    type: CELL_CONTENT.EMPTY,
    neighborMines: 0,
    state: CELL_STATE.CLOSED,
    triggered: false,
    wrongFlag: false,
  }
}

export function generateField(rows, cols, minesCount) {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createEmptyCell())
  )

  let placed = 0
  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    if (grid[row][col].type !== CELL_CONTENT.MINE) {
      grid[row][col].type = CELL_CONTENT.MINE
      placed++
    }
  }

  countNeighbourMines(grid, rows, cols)
  return grid
}

export function countNeighbourMines(grid, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].type === CELL_CONTENT.MINE) continue

      let count = 0
      for (const [dr, dc] of DIRECTIONS) {
        const nr = row + dr
        const nc = col + dc
        if (
          isInBounds(nr, nc, rows, cols) &&
          grid[nr][nc].type === CELL_CONTENT.MINE
        ) {
          count++
        }
      }
      grid[row][col].neighborMines = count
    }
  }
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

export function getFlaggedCount(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length
}

export function checkWin(board) {
  return board.every((row) =>
    row.every(
      (cell) => cell.type === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPENED
    )
  )
}

