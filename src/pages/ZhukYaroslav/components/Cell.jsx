import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Cell({ cellData, row, col, gameStatus, onLeftClick, onRightClick }) {
  let content = '';
  let cellClasses = [styles.cell];

  // ЛОГІКА ХИБНОГО ПРАПОРЦЯ: Якщо програли, а прапорець стоїть НЕ на міні
  if (gameStatus === 'lost' && cellData.state === 'flagged' && cellData.type !== 'mine') {
    content = '❌';
    cellClasses.push(styles.exploded); // Підсвічуємо червоним
  } 
  else if (cellData.state === 'open') {
    cellClasses.push(styles.revealed);
    
    if (cellData.type === 'mine') {
      content = '💣';
      cellClasses.push(styles.exploded);
    } else if (cellData.neighborMines > 0) {
      content = cellData.neighborMines;
      if (styles[`num${cellData.neighborMines}`]) {
         cellClasses.push(styles[`num${cellData.neighborMines}`]);
      }
    }
  } else if (cellData.state === 'flagged') {
    content = '🚩';
  }

  return (
    <button
      type="button" 
      aria-label={`Row ${row + 1}, column ${col + 1}, ${cellData.state}`}
      className={cellClasses.join(' ')}
      onClick={() => onLeftClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(row, col);
      }}
    >
      {content}
    </button>
  );
}