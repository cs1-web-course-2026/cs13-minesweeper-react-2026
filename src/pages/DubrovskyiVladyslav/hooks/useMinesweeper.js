import { useState, useEffect, useCallback } from 'react';
import { STATUS, CELL_TYPE, CELL_STATE } from '../constants';

export const useMinesweeper = (rows = 10, cols = 10, initialMines = 15) => {
    const minesCount = Math.min(initialMines, rows * cols - 1);
    const [field, setField] = useState([]);
    const [status, setStatus] = useState(STATUS.PROCESS);
    const [gameTime, setGameTime] = useState(0);

    const getNeighbors = (r, c) => {
        const neighbors = [];
        for (let dRow = -1; dRow <= 1; dRow++) {
            for (let dCol = -1; dCol <= 1; dCol++) {
                if (dRow === 0 && dCol === 0) continue;
                const nRow = r + dRow;
                const nCol = c + dCol;
                if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
                    neighbors.push([nRow, nCol]);
                }
            }
        }
        return neighbors;
    };

    const generateField = useCallback(() => {
        const newField = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({
                type: CELL_TYPE.EMPTY,
                state: CELL_STATE.CLOSED,
                neighborMines: 0
            }))
        );

        let plantedMinesCount = 0;
        while (plantedMinesCount < minesCount) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            if (newField[r][c].type !== CELL_TYPE.MINE) {
                newField[r][c].type = CELL_TYPE.MINE;
                plantedMinesCount++;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (newField[r][c].type !== CELL_TYPE.MINE) {
                    newField[r][c].neighborMines = getNeighbors(r, c).filter(
                        ([nR, nC]) => newField[nR][nC].type === CELL_TYPE.MINE
                    ).length;
                }
            }
        }
        return newField;
    }, [rows, cols, minesCount]);

    const reset = useCallback(() => {
        setStatus(STATUS.PROCESS);
        setGameTime(0);
        setField(generateField());
    }, [generateField]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        let timerId;
        if (status === STATUS.PROCESS) {
            timerId = setInterval(() => setGameTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(timerId);
    }, [status]);

    const checkWin = (currentField) => {
        const isWon = currentField.flat().every(c =>
            (c.type === CELL_TYPE.MINE && c.state !== CELL_STATE.OPENED) ||
            (c.type === CELL_TYPE.EMPTY && c.state === CELL_STATE.OPENED)
        );
        if (isWon) setStatus(STATUS.WIN);
    };

    const openCell = (row, col) => {
        if (status !== STATUS.PROCESS) return;

        setField(prevField => {
            const newField = prevField.map(r => r.map(c => ({ ...c })));
            const cell = newField[row][col];

            if (cell.state !== CELL_STATE.CLOSED) return prevField;

            if (cell.type === CELL_TYPE.MINE) {
                setStatus(STATUS.LOSE);
                newField.flat().forEach(c => {
                    if (c.type === CELL_TYPE.MINE) c.state = CELL_STATE.OPENED;
                });
                return newField;
            }

            const openRecursive = (r, c) => {
                const currentCell = newField[r][c];
                if (currentCell.state !== CELL_STATE.CLOSED) return;

                currentCell.state = CELL_STATE.OPENED;
                if (currentCell.neighborMines === 0) {
                    getNeighbors(r, c).forEach(([nR, nC]) => openRecursive(nR, nC));
                }
            };

            openRecursive(row, col);
            checkWin(newField);
            return newField;
        });
    };

    const toggleFlag = (row, col) => {
        if (status !== STATUS.PROCESS) return;
        setField(prevField => {
            const newField = prevField.map(r => r.map(c => ({ ...c })));
            const cell = newField[row][col];
            if (cell.state === CELL_STATE.OPENED) return prevField;

            cell.state = cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;
            return newField;
        });
    };

    const flagsCount = field.flat().filter(c => c.state === CELL_STATE.FLAGGED).length;

    return { field, status, gameTime, minesLeft: minesCount - flagsCount, reset, openCell, toggleFlag, rows, cols };
};