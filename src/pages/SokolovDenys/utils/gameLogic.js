// src/pages/SokolovDenys/utils/gameLogic.js

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

/**
 * Генерує ігрове поле та розставляє міни.
 */
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

/**
 * ПІДРАХУНОК СУСІДІВ (Іммутабельно)
 */
export const countAllNeighbours = (field, rows, cols) => {
  const newField = field.map(row => row.map(cell => ({ ...cell })));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newField[row][col].type === CELL_CONTENT.MINE) continue;

      let count = 0;
      DIRECTIONS.forEach(([directionalRow, directionalCol]) => {
        const neighbourRow = row + directionalRow;
        const neighbourCol = col + directionalCol;
        if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols) {
          if (newField[neighbourRow][neighbourCol].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
      });
      newField[row][col].neighborMines = count;
    }
  }
  return newField;
};

/**
 * РЕКУРСИВНЕ ВІДКРИТТЯ (FIXED): Повертає новий масив без мутації вхідного.
 */
export const floodFill = (grid, row, col, rows, cols) => {
  // 1. Створюємо глибоку копію існуючої сітки
  const nextGrid = grid.map((gridRow) =>
    gridRow.map((cell) => ({
      ...cell,
    }))
  );

  // 2. Внутрішня функція для рекурсії по копії
  const openConnectedCells = (currentRow, currentCol) => {
    if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) return;
    
    const cell = nextGrid[currentRow][currentCol];
    if (cell.state !== CELL_STATE.CLOSED || cell.type === CELL_CONTENT.MINE) return;

    // Оновлюємо стан клітинки в копії
    nextGrid[currentRow][currentCol] = {
      ...cell,
      state: CELL_STATE.OPEN,
    };

    // Якщо клітинка порожня (0 мін навколо), рекурсивно йдемо далі
    if (cell.neighborMines === 0) {
      DIRECTIONS.forEach(([directionalRow, directionalCol]) =>
        openConnectedCells(currentRow + directionalRow, currentCol + directionalCol)
      );
    }
  };

  // Запускаємо процес
  openConnectedCells(row, col);

  // Повертаємо оновлену копію
  return nextGrid;
};

/**
 * Перевірка умови перемоги.
 */
export const checkWinCondition = (currentField) => {
  return currentField.flat().every(cell => 
    cell.type === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPEN
  );
};