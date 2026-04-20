import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

export default function Board({ field, cols, onCellClick, onCellRightClick }) {
  return (
    <div 
      className={styles.gameBoard} 
      style={{ 
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${cols}, 35px)` 
      }}
    >
      {/* Проходимося по кожному рядку масиву */}
      {field.map((row, rowIndex) => (
        // Проходимося по кожній клітинці в рядку
        row.map((cell, colIndex) => (
          <Cell 
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            cellData={cell}
            onLeftClick={onCellClick}
            onRightClick={onCellRightClick}
          />
        ))
      ))}
    </div>
  );
}