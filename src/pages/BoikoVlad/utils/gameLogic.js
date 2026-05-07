export function createGameField(rows, cols, minesCount) {
  const field = generateField(rows, cols, minesCount);
  countNeighbourMines(field);
  return field;
}

function generateField(rows, cols, minesCount) {
  const field = [];

  for (let r = 0; r < rows; r++) {
    const row = [];

    for (let c = 0; c < cols; c++) {
      row.push({
        type: "empty",
        neighborMines: 0,
        state: "closed",
      });
    }

    field.push(row);
  }

  let placed = 0;

  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (field[r][c].type !== "mine") {
      field[r][c].type = "mine";
      placed++;
    }
  }

  return field;
}

function countNeighbourMines(field) {
  const rows = field.length;
  const cols = field[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c].type === "mine") continue;

      let count = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            field[nr][nc].type === "mine"
          ) {
            count++;
          }
        }
      }

      field[r][c].neighborMines = count;
    }
  }
}

export function openCell(field, rowIndex, colIndex) {
  const newField = field.map((row) =>
    row.map((cell) => ({ ...cell }))
  );

  const result = openCellRecursive(newField, rowIndex, colIndex);

  return {
    newField,
    result,
  };
}

function openCellRecursive(field, rowIndex, colIndex) {
  const rows = field.length;
  const cols = field[0].length;

  if (
    rowIndex < 0 ||
    rowIndex >= rows ||
    colIndex < 0 ||
    colIndex >= cols
  ) {
    return "process";
  }

  const cell = field[rowIndex][colIndex];

  if (cell.state === "opened" || cell.state === "flagged") {
    return "process";
  }

  cell.state = "opened";

  if (cell.type === "mine") {
    return "lose";
  }

  if (cell.neighborMines > 0) {
    return "process";
  }

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;

      openCellRecursive(field, rowIndex + dr, colIndex + dc);
    }
  }

  return "process";
}

export function toggleFlag(field, rowIndex, colIndex) {
  return field.map((row, r) =>
    row.map((cell, c) => {
      if (r !== rowIndex || c !== colIndex) return cell;
      if (cell.state === "opened") return cell;

      return {
        ...cell,
        state: cell.state === "flagged" ? "closed" : "flagged",
      };
    })
  );
}

export function checkWin(field, rows, cols, minesCount) {
  let openedCells = 0;

  field.forEach((row) => {
    row.forEach((cell) => {
      if (cell.state === "opened") {
        openedCells++;
      }
    });
  });

  const totalSafeCells = rows * cols - minesCount;

  return openedCells === totalSafeCells;
}

export function countFlags(field) {
  return field.flat().filter((cell) => cell.state === "flagged").length;
}