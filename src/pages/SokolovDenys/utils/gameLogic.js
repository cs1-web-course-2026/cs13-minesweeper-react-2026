export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

export const CELL_CONTENT = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const generateField = (rows, cols, minesCount) => {
  const totalCells = rows * cols;
  const safeMinesCount = minesCount >= totalCells ? totalCells - 1 : minesCount;

  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_CONTENT.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < safeMinesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (field[row][col].type !== CELL_CONTENT.MINE) {
      field[row][col].type = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  return countAllNeighbours(field, rows, cols);
};

export const countAllNeighbours = (field, rows, cols) => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (field[row][col].type === CELL_CONTENT.MINE) continue;

      let count = 0;
      DIRECTIONS.forEach(([directionalRow, directionalCol]) => {
        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;
        if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
          if (field[neighbourRow][neighbourCol].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
      });
      field[row][col].neighborMines = count;
    }
  }
  return field;
};

export const floodFill = (grid, row, col, rows, cols) => {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  const cell = grid[row][col];
  if (cell.state !== CELL_STATE.CLOSED || cell.type === CELL_CONTENT.MINE) return;

  cell.state = CELL_STATE.OPEN;

  if (cell.neighborMines === 0) {
    DIRECTIONS.forEach(([directionalRow, directionalCol]) => 
      floodFill(grid, row + directionalRow, col + directionalCol, rows, cols)
    );
  }
};

export const checkWinCondition = (currentField) => {
  return currentField.flat().every(cell => 
    cell.type === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPEN
  );
};