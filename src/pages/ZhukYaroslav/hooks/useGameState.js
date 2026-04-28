import { useState, useCallback } from 'react';
import { GAME_STATUS, CELL_STATE, CELL_CONTENT } from '../constants/game';
import { createBoard, placeMines, calculateNeighbors, floodFillReveal, checkWinCondition } from '../utils/board';

export function useGameState(initialRows, initialCols, initialMines) {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [mineCount, setMineCount] = useState(initialMines);

  const [field, setField] = useState([]);
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Функція initGame тепер приймає параметри для кнопок складності
  const initGame = useCallback((newRows = rows, newCols = cols, newMines = mineCount) => {
    setRows(newRows);
    setCols(newCols);
    setMineCount(newMines);

    const newBoard = createBoard(newRows, newCols);
    // Міни НЕ ставимо одразу. Вони з'являться після першого кліку.
    setField(newBoard);
    setStatus(GAME_STATUS.PLAYING);
    setFlagsPlaced(0);
    setTimerActive(false);
    setIsFirstClick(true);
    setResetKey(prev => prev + 1);
  }, [rows, cols, mineCount]);

  const openCell = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state !== CELL_STATE.CLOSED) return;

    let newField = field.map((fieldRow) => fieldRow.map((cell) => ({ ...cell })));

    // ЛОГІКА ПЕРШОГО КЛІКУ: Генеруємо міни та стартуємо таймер
    if (isFirstClick) {
      newField = placeMines(newField, rows, cols, mineCount, row, col);
      newField = calculateNeighbors(newField, rows, cols);
      setIsFirstClick(false);
      setTimerActive(true);
    }

    if (newField[row][col].type === CELL_CONTENT.MINE) {
      // ПРОГРАШ: Відкриваємо всі міни
      newField.forEach(r => r.forEach(c => {
         // Якщо це міна і на ній немає прапорця — показуємо її
         if (c.type === CELL_CONTENT.MINE && c.state !== CELL_STATE.FLAGGED) {
             c.state = CELL_STATE.OPEN;
         }
      }));
      newField[row][col].state = CELL_STATE.OPEN;
      setStatus(GAME_STATUS.LOST);
      setTimerActive(false);
    } else {
      newField = floodFillReveal(newField, row, col, rows, cols);
      if (checkWinCondition(newField)) {
        setStatus(GAME_STATUS.WIN);
        setTimerActive(false);
      }
    }
    setField(newField);
  };

  const toggleFlag = (row, col) => {
    if (status !== GAME_STATUS.PLAYING || field[row][col].state === CELL_STATE.OPEN) return;
    
    const newField = field.map((fieldRow) => fieldRow.map((cell) => ({ ...cell })));
    const cell = newField[row][col];
    
    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsPlaced(prev => prev + 1);
    } else if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsPlaced(prev => prev - 1);
    }
    setField(newField);
  };

  return { field, rows, cols, mineCount, status, flagsPlaced, timerActive, resetKey, openCell, toggleFlag, initGame };
}