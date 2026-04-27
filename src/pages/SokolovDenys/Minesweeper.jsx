// src/pages/SokolovDenys/Minesweeper.jsx
import React, { useState, useEffect } from 'react';
import { 
  generateField, 
  GAME_STATUS, 
  CELL_STATE, 
  CELL_CONTENT, 
  DIRECTIONS 
} from './utils/gameLogic';
import Board from './components/Board/Board';
import Scoreboard from './components/Scoreboard/Scoreboard';
import styles from './Minesweeper.module.css';
import Modal from './components/Modal/Modal';

const Minesweeper = () => {
  const [config] = useState({ rows: 5, cols: 5, mines: 5 });

  const [field, setField] = useState(() => generateField(config.rows, config.cols, config.mines));
  const [status, setStatus] = useState(GAME_STATUS.IDLE);
  const [timer, setTimer] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(config.mines);

  useEffect(() => {
    let interval;
    if (status === GAME_STATUS.PLAYING) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval); 
  }, [status]);

  const handleOpenCell = (r, c) => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return;
    if (field[r][c].state !== CELL_STATE.CLOSED) return;

    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];

    if (status === GAME_STATUS.IDLE) setStatus(GAME_STATUS.PLAYING);

    if (cell.type === CELL_CONTENT.MINE) {
      cell.state = CELL_STATE.OPEN;
      setField(newField);
      setStatus(GAME_STATUS.LOST);
      return;
    }

    floodFill(newField, r, c);
    setField(newField);
    checkWin(newField);
  };

  const handleFlagCell = (r, c) => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return;
    if (field[r][c].state === CELL_STATE.OPEN) return;

    const newField = field.map(row => row.map(cell => ({ ...cell })));
    const cell = newField[r][c];

    if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsLeft(prev => prev + 1);
    } else if (flagsLeft > 0) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsLeft(prev => prev - 1);
    }

    setField(newField);
  };

  const floodFill = (grid, r, c) => {
    if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) return;
    const cell = grid[r][c];
    if (cell.state !== CELL_STATE.CLOSED || cell.type === CELL_CONTENT.MINE) return;

    cell.state = CELL_STATE.OPEN;

    if (cell.neighborMines === 0) {
      DIRECTIONS.forEach(([dr, dc]) => floodFill(grid, r + dr, c + dc));
    }
  };

  const checkWin = (currentField) => {
    const isWin = currentField.flat().every(cell => 
      cell.type === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPEN
    );
    if (isWin) setStatus(GAME_STATUS.WON);
  };

  const resetGame = () => {
    setField(generateField(config.rows, config.cols, config.mines));
    setStatus(GAME_STATUS.IDLE);
    setTimer(0);
    setFlagsLeft(config.mines);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.gameContainer}>
        <Scoreboard 
          timer={timer} 
          onReset={resetGame} 
          status={status} 
          flagsLeft={flagsLeft} 
        />
        
        <Board 
          field={field} 
          rows={config.rows} 
          cols={config.cols} 
          onCellClick={handleOpenCell}
          onCellFlag={handleFlagCell}
        />

        <Modal 
          isOpen={status === GAME_STATUS.WON || status === GAME_STATUS.LOST}
          title={status === GAME_STATUS.WON ? '🎉 ПЕРЕМОГА!' : '💥'}
          message={status === GAME_STATUS.WON 
            ? `Твій час: ${timer} сек!` 
            : 'Ти натрапив на міну. Спробуй ще раз!'}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
};

export default Minesweeper;