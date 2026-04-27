export const GAME_STATUS = { IDLE: 'idle', PLAYING: 'playing', WON: 'won', LOST: 'lost' };
export const CELL_CONTENT = { EMPTY: 'empty', MINE: 'mine' };
export const CELL_STATE = { CLOSED: 'closed', OPEN: 'open', FLAGGED: 'flagged' };
export const DIRECTIONS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

export const generateField = (rows, cols, minesCount) => {
  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_CONTENT.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (field[r][c].type !== CELL_CONTENT.MINE) {
      field[r][c].type = CELL_CONTENT.MINE;
      placedMines++;
    }
  }

  return countAllNeighbours(field, rows, cols);
};

export const countAllNeighbours = (field, rows, cols) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === CELL_CONTENT.MINE) continue;

      let count = 0;
      DIRECTIONS.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (field[nr][nc].type === CELL_CONTENT.MINE) {
            count++;
          }
        }
      });
      field[r][c].neighborMines = count;
    }
  }
  return field;
};