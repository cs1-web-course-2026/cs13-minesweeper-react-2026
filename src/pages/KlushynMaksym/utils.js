import { CELL_CONTENT, CELL_STATE, DIRECTIONS } from './constants';

export const cloneBoard = (board) => board.map(row => row.map(cell => ({ ...cell })));

export const initializeEmptyBoard = (rowsCount, colsCount) => {
    const newBoard = [];
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const currentRow = [];
        for (let colIndex = 0; colIndex < colsCount; colIndex++) {
            currentRow.push({ type: CELL_CONTENT.EMPTY, state: CELL_STATE.CLOSED, neighborMines: 0 });
        }
        newBoard.push(currentRow);
    }
    return newBoard;
};

export const placeMinesAndCalculateNeighbors = (board, clickedRow, clickedCol, rowsCount, colsCount, maxMines) => {
    let placedMines = 0;
    while (placedMines < maxMines) {
        const randomRow = Math.floor(Math.random() * rowsCount);
        const randomCol = Math.floor(Math.random() * colsCount);
        
        const isNotClickedCell = !(randomRow === clickedRow && randomCol === clickedCol);
        const isNotAlreadyMine = board[randomRow][randomCol].type !== CELL_CONTENT.MINE;

        if (isNotAlreadyMine && isNotClickedCell) {
            board[randomRow][randomCol].type = CELL_CONTENT.MINE;
            placedMines++;
        }
    }

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        for (let colIndex = 0; colIndex < colsCount; colIndex++) {
            if (board[rowIndex][colIndex].type === CELL_CONTENT.MINE) continue;
            
            let minesCount = 0;
            for (const [deltaRow, deltaCol] of DIRECTIONS) {
                const neighborRow = rowIndex + deltaRow;
                const neighborCol = colIndex + deltaCol;
                
                const isRowValid = neighborRow >= 0 && neighborRow < rowsCount;
                const isColValid = neighborCol >= 0 && neighborCol < colsCount;

                if (isRowValid && isColValid && board[neighborRow][neighborCol].type === CELL_CONTENT.MINE) {
                    minesCount++;
                }
            }
            board[rowIndex][colIndex].neighborMines = minesCount;
        }
    }
    return board;
};

export const revealCellsRecursively = (board, targetRow, targetCol, rowsCount, colsCount) => {
    const isRowInvalid = targetRow < 0 || targetRow >= rowsCount;
    const isColInvalid = targetCol < 0 || targetCol >= colsCount;
    
    if (isRowInvalid || isColInvalid) return;
    
    const currentCell = board[targetRow][targetCol];
    if (currentCell.state !== CELL_STATE.CLOSED) return;

    currentCell.state = CELL_STATE.OPENED;
    
    if (currentCell.neighborMines === 0) {
        for (const [deltaRow, deltaCol] of DIRECTIONS) {
            revealCellsRecursively(board, targetRow + deltaRow, targetCol + deltaCol, rowsCount, colsCount);
        }
    }
};

export const revealAllMines = (board, rowsCount, colsCount) => {
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        for (let colIndex = 0; colIndex < colsCount; colIndex++) {
            if (board[rowIndex][colIndex].type === CELL_CONTENT.MINE) {
                board[rowIndex][colIndex].state = CELL_STATE.OPENED;
            }
        }
    }
};

export const checkIsGameWon = (board, rowsCount, colsCount, totalMines) => {
    let openedSafeCells = 0;
    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        for (let colIndex = 0; colIndex < colsCount; colIndex++) {
            const cell = board[rowIndex][colIndex];
            if (cell.state === CELL_STATE.OPENED && cell.type !== CELL_CONTENT.MINE) {
                openedSafeCells++;
            }
        }
    }
    return openedSafeCells === (rowsCount * colsCount) - totalMines;
};