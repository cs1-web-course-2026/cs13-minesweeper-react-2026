import React from 'react';
import Cell from './Cell';
import styles from '../Minesweeper.module.css';

export default function Board({ field, cols, gameStatus, onCellClick, onCellRightClick }) {
  return (
    <div 
      className={styles.gameBoard} 
      style={{ gridTemplateColumns: `repeat(${cols}, 35px)` }}
    >
      {field.map((fieldRow, row) => 
        fieldRow.map((cell, col) => (
          <Cell 
            key={`${row}-${col}`}
            row={row}
            col={col}
            cellData={cell}
            gameStatus={gameStatus} // Передали статус
            onLeftClick={onCellClick}
            onRightClick={onCellRightClick}
          />
        ))
      )}
    </div>
  );
}