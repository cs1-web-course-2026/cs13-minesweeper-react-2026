import React, { useState, useEffect } from 'react';
import { 
  generateField, 
  checkWinCondition, 
  floodFill,
  GAME_STATUS, 
  CELL_STATE, 
  CELL_CONTENT 
} from './utils/gameLogic';
import Board from './components/Board/Board';
import Scoreboard from './components/Scoreboard/Scoreboard';
import Modal from './components/Modal/Modal';
import styles from './Minesweeper.module.css';

const Minesweeper = () => {
  const [config] = useState({ rows: 5, cols: 5, mines: 5 });
  const [field, setField] = useState(() => generateField(config.rows, config.cols, config.mines));
  const [status, setStatus] = useState(GAME_STATUS.IDLE);
  const [timer, setTimer] = useState(0);
  const [flagsLeft, setFlagsLeft] = useState(config.mines);

  // Helper function to deep clone the field to avoid direct mutation
  const cloneField = (currentField) => {
    return currentField.map(fieldRow => fieldRow.map(cell => ({ ...cell })));
  };

  useEffect(() => {
    let interval;
    if (status === GAME_STATUS.PLAYING) {
      interval = setInterval(() => setTimer((previousTimer) => previousTimer + 1), 1000);
    }
    return () => clearInterval(interval); 
  }, [status]);

  const handleOpenCell = (row, col) => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return;
    if (field[row][col].state !== CELL_STATE.CLOSED) return;

    const newField = cloneField(field);
    const cell = newField[row][col];

    if (status === GAME_STATUS.IDLE) setStatus(GAME_STATUS.PLAYING);

    if (cell.type === CELL_CONTENT.MINE) {
      cell.state = CELL_STATE.OPEN;
      setField(newField);
      setStatus(GAME_STATUS.LOST);
      return;
    }

    floodFill(newField, row, col, config.rows, config.cols);
    setField(newField);
    
    if (checkWinCondition(newField)) {
      setStatus(GAME_STATUS.WON);
    }
  };

  const handleFlagCell = (row, col) => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) return;
    if (field[row][col].state === CELL_STATE.OPEN) return;

    const newField = cloneField(field);
    const cell = newField[row][col];

    if (cell.state === CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.CLOSED;
      setFlagsLeft(prev => prev + 1);
    } else if (flagsLeft > 0) {
      cell.state = CELL_STATE.FLAGGED;
      setFlagsLeft(prev => prev - 1);
    }

    setField(newField);
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
          gameStatus={status}
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