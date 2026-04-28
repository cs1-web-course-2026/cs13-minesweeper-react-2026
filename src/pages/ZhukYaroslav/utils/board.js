import { CELL_CONTENT, CELL_STATE, DIRECTIONS } from '../constants/game';

export function createBoard(rows, cols) {
  const board = [];
  for (let row = 0; row < rows; row++) {
    const boardRow = [];
    for (let col = 0; col < cols; col++) {
      boardRow.push({ type: CELL_CONTENT.EMPTY, neighborMines: 0, state: CELL_STATE.CLOSED });
    }
    board.push(boardRow);
  }
  return board;
}

// Додали safeRow та safeCol, щоб там ніколи не було міни
export function placeMines(board, rows, cols, mineCount, safeRow, safeCol) {
  let placed = 0;
  while (placed < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    // Якщо це клітинка першого кліку або там вже є міна — пропускаємо
    if ((row === safeRow && col === safeCol) || board[row][col].type === CELL_CONTENT.MINE) {
      continue;
    }
    board[row][col].type = CELL_CONTENT.MINE;
    placed++;
  }
  return board;
}

export function calculateNeighbors(board, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].type === CELL_CONTENT.MINE) continue;
      let count = 0;
      for (const [directionalRow, directionalCol] of DIRECTIONS) {
        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;
        if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
          if (board[neighbourRow][neighbourCol].type === CELL_CONTENT.MINE) count++;
        }
      }
      board[row][col].neighborMines = count;
    }
  }
  return board;
}

export function checkWinCondition(board) {
  return board.every(row => row.every(cell => cell.type === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPEN));
}

export function floodFillReveal(board, startRow, startCol, rows, cols) {
  const reveal = (row, col) => {
    if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col].state !== CELL_STATE.CLOSED) return;
    board[row][col].state = CELL_STATE.OPEN;
    if (board[row][col].neighborMines === 0 && board[row][col].type !== CELL_CONTENT.MINE) {
      for (const [directionalRow, directionalCol] of DIRECTIONS) {
        reveal(row + directionalRow, col + directionalCol);
      }
    }
  };
  reveal(startRow, startCol);
  return board;
}