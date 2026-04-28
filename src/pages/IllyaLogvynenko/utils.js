import { CELL_CONTENT, CELL_STATE, GAME_STATUS } from './constants/game'

export function createCell() {
  return {
    type: CELL_CONTENT.EMPTY,
    neighborMines: 0,
    state: CELL_STATE.CLOSED
  };
}

export function createEmptyBoard(rowsCount, colsCount) {
  return Array.from({ length: rowsCount }, () =>
    Array.from({ length: colsCount }, () => createCell())
  );
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function getAdjacentCells(grid, row, col) {
  if (grid.length === 0) {
    return [];
  }

  const rowCount = grid.length;
  const colCount = grid[0].length;
  const adjacentCells = [];

  for (let directionRow = -1; directionRow <= 1; directionRow += 1) {
    for (let directionCol = -1; directionCol <= 1; directionCol += 1) {
      if (directionRow === 0 && directionCol === 0) {
        continue;
      }

      const neighborRow = row + directionRow;
      const neighborCol = col + directionCol;

      if (
        neighborRow >= 0 &&
        neighborRow < rowCount &&
        neighborCol >= 0 &&
        neighborCol < colCount
      ) {
        adjacentCells.push({
          cell: grid[neighborRow][neighborCol],
          row: neighborRow,
          col: neighborCol
        });
      }
    }
  }

  return adjacentCells;
}

export function countAdjacentMines(grid) {
  if (grid.length === 0) {
    return [];
  }

  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cell.type === CELL_CONTENT.MINE) {
        return {
          ...cell,
          neighborMines: 0
        };
      }

      return {
        ...cell,
        neighborMines: getAdjacentCells(grid, rowIndex, colIndex)
          .filter(({ cell: adjacentCell }) => adjacentCell.type === CELL_CONTENT.MINE)
          .length
      };
    })
  );
}

export function placeMines(board, safeRow, safeCol, minesCount) {
  const rowsCount = board.length;
  const colsCount = rowsCount > 0 ? board[0].length : 0;

  if (minesCount < 0 || minesCount >= rowsCount * colsCount) {
    throw new Error(
      `minesCount (${minesCount}) must be between 0 and ${rowsCount * colsCount - 1}`
    );
  }

  const nextBoard = cloneBoard(board);
  let placedMines = 0;

  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rowsCount);
    const col = Math.floor(Math.random() * colsCount);

    if (row === safeRow && col === safeCol) {
      continue;
    }

    if (nextBoard[row][col].type !== CELL_CONTENT.MINE) {
      nextBoard[row][col].type = CELL_CONTENT.MINE;
      placedMines += 1;
    }
  }

  return countAdjacentMines(nextBoard);
}

export function countFlaggedCells(grid) {
  return grid.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length;
}

export function checkWinCondition(grid) {
  return grid.every((row) =>
    row.every((cell) => {
      if (cell.type === CELL_CONTENT.MINE) {
        return cell.state !== CELL_STATE.OPENED;
      }

      return cell.state === CELL_STATE.OPENED;
    })
  );
}

export function formatCounterValue(value) {
  return String(Math.min(Math.max(value, 0), 999)).padStart(3, '0');
}

export function getStatusMessage(status) {
  if (status === GAME_STATUS.WON) {
    return 'You win!';
  }

  if (status === GAME_STATUS.LOST) {
    return 'Game over!';
  }

  return '';
}

export function getRestartFace(status) {
  const faces = {
    [GAME_STATUS.WON]: '😎',
    [GAME_STATUS.LOST]: '😵',
    [GAME_STATUS.PLAYING]: '🙂'
  };

  return faces[status] || '🙂';
}

export function getCellAriaLabel(row, col, cell) {
  let stateLabel = 'closed';

  if (cell.state === CELL_STATE.FLAGGED) {
    stateLabel = 'flagged';
  } else if (cell.state === CELL_STATE.OPENED) {
    if (cell.type === CELL_CONTENT.MINE) {
      stateLabel = 'mine';
    } else if (cell.neighborMines > 0) {
      stateLabel = `${cell.neighborMines} adjacent mines`;
    } else {
      stateLabel = 'opened, empty';
    }
  }

  return `Row ${row + 1}, column ${col + 1}, ${stateLabel}`;
}

export function createInitialGameState(settings) {
  return {
    ...settings,
    status: GAME_STATUS.PLAYING,
    gameTime: 0,
    board: createEmptyBoard(settings.rows, settings.cols),
    explodedCell: null,
    firstMoveMade: false
  };
}

export function revealCells(board, row, col) {
  if (
    board.length === 0 ||
    row < 0 ||
    row >= board.length ||
    col < 0 ||
    col >= board[0].length
  ) {
    return {
      board,
      status: GAME_STATUS.PLAYING,
      explodedCell: null
    };
  }

  const nextBoard = cloneBoard(board);
  let status = GAME_STATUS.PLAYING;
  let explodedCell = null;

  function revealRecursive(currentRow, currentCol) {
    if (
      currentRow < 0 ||
      currentRow >= nextBoard.length ||
      currentCol < 0 ||
      currentCol >= nextBoard[0].length
    ) {
      return;
    }

    const cell = nextBoard[currentRow][currentCol];

    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) {
      return;
    }

    cell.state = CELL_STATE.OPENED;

    if (cell.type === CELL_CONTENT.MINE) {
      status = GAME_STATUS.LOST;
      explodedCell = { row: currentRow, col: currentCol };
      return;
    }

    if (cell.neighborMines === 0) {
      getAdjacentCells(nextBoard, currentRow, currentCol).forEach(
        ({ row: neighborRow, col: neighborCol }) => {
          revealRecursive(neighborRow, neighborCol);
        }
      );
    }
  }

  revealRecursive(row, col);

  return {
    board: nextBoard,
    status,
    explodedCell
  };
}
