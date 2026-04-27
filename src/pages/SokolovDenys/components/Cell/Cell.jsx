import React from 'react';
import { CELL_STATE, CELL_CONTENT } from '../../utils/gameLogic';
import styles from './Cell.module.css';

const Cell = ({ data, onOpen, onFlag, row, col }) => {
  const renderContent = () => {
    if (data.state === CELL_STATE.CLOSED) return null; 
    if (data.state === CELL_STATE.FLAGGED) return '🚩'; 
    if (data.type === CELL_CONTENT.MINE) return '💣';     
    if (data.neighborMines > 0) return data.neighborMines; 
    return null; 
  };

  const getCellClassName = () => {
    let classes = [styles.cell];
    if (data.state === CELL_STATE.OPEN) classes.push(styles.revealed);
    if (data.state === CELL_STATE.FLAGGED) classes.push(styles.flag);
    if (data.type === CELL_CONTENT.MINE && data.state === CELL_STATE.OPEN) classes.push(styles.exploded);
    if (data.neighborMines > 0 && data.state === CELL_STATE.OPEN) {
        classes.push(styles[`number-${data.neighborMines}`]);
    }
    return classes.join(' ');
  };

  return (
    <button 
      type="button"
      className={getCellClassName()}
      onClick={onOpen} 
      aria-label={`Клітинка ряд ${row + 1}, стовпець ${col + 1}, стан ${data.state}`}
      onContextMenu={(event) => {
        event.preventDefault(); 
        onFlag(); 
      }}
    >
      {renderContent()}
    </button>
  );
};

export default Cell;